#!/usr/bin/env python3
"""
대용량 CSV를 수업용 분석본으로 축소합니다.
- 무작위 표본 추출(시드 고정)으로 재현 가능
- 긴 텍스트 열 제거(USvideos, Netflix)
원본은 같은 파일명으로 덮어씁니다. 백업이 필요하면 실행 전 복사하세요.
"""
from __future__ import annotations

import csv
import os
import random
import tempfile

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_DIR = os.path.normpath(os.path.join(SCRIPT_DIR, "..", "dataset"))

random.seed(42)


def stream_resample(
    in_path: str,
    out_path: str,
    sample_k: int,
    pick_cols: list[str] | None,
) -> None:
    with open(in_path, "r", newline="", encoding="utf-8", errors="replace") as f:
        reader = csv.reader(f)
        header = next(reader)

        if pick_cols:
            indices = []
            new_header: list[str] = []
            for name in pick_cols:
                if name not in header:
                    raise ValueError(f"열 없음 {name!r} in {in_path}")
                indices.append(header.index(name))
                new_header.append(name)
        else:
            indices = list(range(len(header)))
            new_header = header

        hlen = len(header)

        def pick(row: list[str]) -> list[str]:
            if len(row) < hlen:
                row = row + [""] * (hlen - len(row))
            elif len(row) > hlen:
                row = row[:hlen]
            return [row[i] for i in indices]

        reservoir: list[list[str]] = []
        for i, row in enumerate(reader):
            try:
                out_row = pick(row)
            except (IndexError, ValueError):
                continue
            if i < sample_k:
                reservoir.append(out_row)
            else:
                j = random.randint(0, i)
                if j < sample_k:
                    reservoir[j] = out_row

    fd, tmp_path = tempfile.mkstemp(suffix=".csv", dir=os.path.dirname(out_path))
    os.close(fd)
    try:
        with open(tmp_path, "w", newline="", encoding="utf-8") as wf:
            w = csv.writer(wf, quoting=csv.QUOTE_MINIMAL)
            w.writerow(new_header)
            w.writerows(reservoir)
        os.replace(tmp_path, out_path)
    except Exception:
        if os.path.isfile(tmp_path):
            os.unlink(tmp_path)
        raise

    print(
        f"OK {os.path.basename(out_path)}: "
        f"{len(reservoir)}행 × {len(new_header)}열"
    )


def main() -> None:
    jobs: list[tuple[str, int, list[str] | None]] = [
        (
            "09 USvideos.csv",
            3000,
            [
                "video_id",
                "trending_date",
                "title",
                "channel_title",
                "category_id",
                "publish_time",
                "views",
                "likes",
                "dislikes",
                "comment_count",
                "comments_disabled",
                "ratings_disabled",
                "video_error_or_removed",
            ],
        ),
        ("19 diamonds.csv", 10000, None),
        ("04 Air Quality Data in India.csv", 8000, None),
        (
            "08 netflix_titles.csv",
            3500,
            [
                "show_id",
                "type",
                "title",
                "director",
                "country",
                "date_added",
                "release_year",
                "rating",
                "duration",
                "listed_in",
            ],
        ),
        ("07 Superstore.csv", 5000, None),
    ]

    for name, k, cols in jobs:
        path = os.path.join(DATASET_DIR, name)
        if not os.path.isfile(path):
            print(f"건너뜀(없음): {name}")
            continue
        stream_resample(path, path, k, cols)


if __name__ == "__main__":
    main()
