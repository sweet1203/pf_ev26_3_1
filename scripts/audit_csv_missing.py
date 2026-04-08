# -*- coding: utf-8 -*-
"""CSV 결측치 점검 (pandas 불필요). practice·assessment/grade2·grade3 대상."""
from __future__ import annotations

import csv
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATASET = ROOT / "dataset"

# 빈 칸·공백만·스프레드시트 결측 표기만 (none/none/na 등은 범주값일 수 있어 제외)
def is_missing(cell: str) -> bool:
    if cell is None:
        return True
    s = str(cell).strip()
    if s == "":
        return True
    low = s.lower()
    return low in ("#n/a", "#na")


def analyze_file(path: Path) -> dict:
    with path.open("r", encoding="utf-8-sig", newline="") as f:
        reader = csv.reader(f)
        rows = list(reader)
    if not rows:
        return {"path": path, "n_rows": 0, "n_cols": 0, "rows_any_missing": 0, "cells_missing": 0, "cells_total": 0, "col_missing": {}}
    header = rows[0]
    n_cols = len(header)
    data_rows = rows[1:]
    n_rows = len(data_rows)
    col_missing = {h: 0 for h in header}
    rows_any = 0
    cells_missing = 0
    cells_total = 0
    for row in data_rows:
        # 열 수 맞춤 (짧으면 빈칸으로 패딩)
        padded = row + [""] * max(0, n_cols - len(row))
        row_has = False
        for i, h in enumerate(header):
            if i >= len(padded):
                break
            cells_total += 1
            if is_missing(padded[i]):
                cells_missing += 1
                col_missing[h] = col_missing.get(h, 0) + 1
                row_has = True
        if row_has:
            rows_any += 1
    return {
        "path": path,
        "n_rows": n_rows,
        "n_cols": n_cols,
        "rows_any_missing": rows_any,
        "cells_missing": cells_missing,
        "cells_total": cells_total,
        "col_missing": col_missing,
    }


def main() -> None:
    roots = [
        ("practice", DATASET / "practice"),
        ("assessment", DATASET / "assessment"),
    ]
    lines = []
    for label, base in roots:
        grades = ["grade2", "grade3"]
        for g in grades:
            d = base / g
            if not d.is_dir():
                lines.append(f"[skip] {d} 없음")
                continue
            csvs = sorted(p for p in d.glob("*.csv") if p.name != "_데이터셋_요약.csv")
            lines.append(f"\n=== {label}/{g} ({len(csvs)} files) ===")
            for p in csvs:
                r = analyze_file(p)
                if r["n_rows"] == 0:
                    lines.append(f"  {p.name}: (빈 파일 또는 헤더만)")
                    continue
                pct_row = 100.0 * r["rows_any_missing"] / r["n_rows"]
                pct_cell = 100.0 * r["cells_missing"] / r["cells_total"] if r["cells_total"] else 0
                lines.append(
                    f"  {p.name}: 행 {r['n_rows']}, 열 {r['n_cols']} | "
                    f"결측 포함 행 {r['rows_any_missing']} ({pct_row:.1f}%) | "
                    f"결측 셀 {r['cells_missing']}/{r['cells_total']} ({pct_cell:.2f}%)"
                )
                cm = sorted(r["col_missing"].items(), key=lambda x: -x[1])
                bad = [(c, n) for c, n in cm if n > 0][:8]
                if bad:
                    parts = [f"{c}:{n}" for c, n in bad]
                    lines.append(f"       열별 결측: " + ", ".join(parts))

    print("\n".join(lines))


if __name__ == "__main__":
    main()
