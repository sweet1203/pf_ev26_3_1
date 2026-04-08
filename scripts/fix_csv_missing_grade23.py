# -*- coding: utf-8 -*-
"""grade2/grade3 CSV 결측 처리: 삭제 후 300행 이상이면 행 삭제, 아니면 열별 대체값."""
from __future__ import annotations

import csv
import statistics
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATASET = ROOT / "dataset"
MIN_ROWS_AFTER_DROP = 300
SKIP_NAMES = {"_데이터셋_요약.csv"}


def is_missing(cell: str) -> bool:
    if cell is None:
        return True
    s = str(cell).strip()
    if s == "":
        return True
    low = s.lower()
    return low in ("#n/a", "#na")


def try_float(s: str) -> float | None:
    try:
        return float(s.replace(",", ""))
    except (ValueError, TypeError):
        return None


def row_has_any_missing(row: list[str], n_cols: int) -> bool:
    padded = row + [""] * max(0, n_cols - len(row))
    for i in range(n_cols):
        if is_missing(padded[i]):
            return True
    return False


def format_fill_num(n: float) -> str:
    if n != n:  # nan
        return "0"
    if abs(n - round(n)) < 1e-9:
        return str(int(round(n)))
    return repr(n) if "e" in str(n).lower() else str(n)


def column_fill_value(rows: list[list[str]], col_idx: int, n_cols: int) -> str:
    vals: list[str] = []
    for row in rows:
        padded = row + [""] * max(0, n_cols - len(row))
        if col_idx >= len(padded):
            continue
        c = padded[col_idx]
        if not is_missing(c):
            vals.append(c)
    if not vals:
        return "미상"
    nums = [try_float(v) for v in vals]
    if all(x is not None for x in nums):
        return format_fill_num(statistics.median(nums))
    mode, _cnt = Counter(vals).most_common(1)[0]
    return mode


def impute_rows(header: list[str], rows: list[list[str]]) -> list[list[str]]:
    n_cols = len(header)
    fills = [column_fill_value(rows, j, n_cols) for j in range(n_cols)]
    out: list[list[str]] = []
    for row in rows:
        padded = row + [""] * max(0, n_cols - len(row))
        new_row = []
        for j in range(n_cols):
            c = padded[j] if j < len(padded) else ""
            new_row.append(fills[j] if is_missing(c) else c)
        out.append(new_row)
    return out


def process_file(path: Path) -> tuple[str, int, int, str]:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.reader(f)
        table = list(reader)
    if not table:
        return path.name, 0, 0, "skip_empty"
    header = table[0]
    n_cols = len(header)
    data = table[1:]
    clean = [r for r in data if not row_has_any_missing(r, n_cols)]
    n_before = len(data)
    if n_before == 0:
        return path.name, 0, 0, "no_data"
    if len(clean) == n_before:
        return path.name, n_before, n_before, "unchanged_no_missing"
    if len(clean) >= MIN_ROWS_AFTER_DROP:
        out_rows = clean
        action = f"drop_missing kept={len(out_rows)}"
    else:
        out_rows = impute_rows(header, data)
        action = f"impute kept={len(out_rows)}"
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f, lineterminator="\n")
        w.writerow(header)
        w.writerows(out_rows)
    return path.name, n_before, len(out_rows), action


def main() -> None:
    base = DATASET / "assessment"
    for grade in ("grade2", "grade3"):
        d = base / grade
        if not d.is_dir():
            continue
        for p in sorted(d.glob("*.csv")):
            if p.name in SKIP_NAMES:
                continue
            name, n0, n1, action = process_file(p)
            print(f"{grade}/{name}: {n0} -> {n1} ({action})")


if __name__ == "__main__":
    main()
