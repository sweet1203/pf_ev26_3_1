#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
dataset/ 루트의 CSV를 읽어 학년별 하위 폴더에 정리합니다.

- 열 이름: 한글(분석·제출 폼 작성에 맞춤, 과도한 맞춤은 지양)
- 결측: (1) 결측 비율이 높은 열 제거 (2) 지정 핵심 열 기준 행 삭제
- 행 수: 2학년은 다소 축소, 3학년은 분석·통계에 쓰기 좋게 상한을 넉넉히

실행: python scripts/prepare_datasets_by_grade.py
"""
from __future__ import annotations

import csv
import os
import random
import re
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parent
SRC_DIR = ROOT / "dataset"
OUT_G2 = SRC_DIR / "grade2"
OUT_G3 = SRC_DIR / "grade3"

random.seed(42)
OUT_ENCODING = "utf-8-sig"


def read_table(path: Path) -> tuple[list[str], list[list[str]]]:
    with open(path, "r", newline="", encoding="utf-8", errors="replace") as f:
        rows = list(csv.reader(f))
    if not rows:
        return [], []
    return rows[0], rows[1:]


def write_table(path: Path, header: list[str], body: list[list[str]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", newline="", encoding=OUT_ENCODING) as f:
        w = csv.writer(f, quoting=csv.QUOTE_MINIMAL)
        w.writerow(header)
        w.writerows(body)


def norm_cell(s: str) -> str:
    if s is None:
        return ""
    return str(s).strip()


def is_empty(s: str) -> bool:
    t = norm_cell(s).lower()
    return t == "" or t in {"na", "nan", "none", "null", "n/a"}


def pick_cols(header: list[str], rows: list[list[str]], names: list[str]) -> tuple[list[str], list[list[str]]]:
    idx = [header.index(n) for n in names]
    new_rows: list[list[str]] = []
    for r in rows:
        if len(r) < len(header):
            r = r + [""] * (len(header) - len(r))
        elif len(r) > len(header):
            r = r[: len(header)]
        new_rows.append([r[i] for i in idx])
    return names, new_rows


def rename_header(header: list[str], mapping: dict[str, str]) -> list[str]:
    return [mapping.get(h, h) for h in header]


def drop_sparse_columns(
    header: list[str], rows: list[list[str]], max_missing_ratio: float
) -> tuple[list[str], list[list[str]]]:
    if not rows:
        return header, rows
    n = len(rows)
    keep_j: list[int] = []
    for j, _ in enumerate(header):
        miss = sum(1 for r in rows if j >= len(r) or is_empty(r[j]))
        if miss / n <= max_missing_ratio:
            keep_j.append(j)
    if keep_j == list(range(len(header))):
        return header, rows
    nh = [header[j] for j in keep_j]
    nr = [[r[j] if j < len(r) else "" for j in keep_j] for r in rows]
    return nh, nr


def drop_rows_missing_in(
    header: list[str], rows: list[list[str]], required_names: list[str]
) -> list[list[str]]:
    idx = [header.index(n) for n in required_names]
    out: list[list[str]] = []
    for r in rows:
        if len(r) < len(header):
            r = r + [""] * (len(header) - len(r))
        if all(not is_empty(r[i]) for i in idx):
            out.append(r[: len(header)])
    return out


def sample_rows(rows: list[list[str]], max_n: int | None) -> list[list[str]]:
    if max_n is None or len(rows) <= max_n:
        return rows
    idxs = list(range(len(rows)))
    random.shuffle(idxs)
    picked = sorted(idxs[:max_n])
    return [rows[i] for i in picked]


def strip_rows(header: list[str], rows: list[list[str]]) -> list[list[str]]:
    out: list[list[str]] = []
    for r in rows:
        if len(r) < len(header):
            r = r + [""] * (len(header) - len(r))
        elif len(r) > len(header):
            r = r[: len(header)]
        if not any(norm_cell(c) for c in r):
            continue
        out.append([norm_cell(c) for c in r])
    return out


def heart_sex_label(v: str) -> str:
    t = norm_cell(v)
    if t in {"1", "1.0"}:
        return "남성"
    if t in {"0", "0.0"}:
        return "여성"
    return t


def heart_target_label(v: str) -> str:
    t = norm_cell(v)
    if t in {"1", "1.0"}:
        return "질환의심"
    if t in {"0", "0.0"}:
        return "정상"
    return t


def process_students_performance(rows: list[list[str]], header: list[str], max_rows: int | None):
    names = [
        "gender",
        "race/ethnicity",
        "parental level of education",
        "lunch",
        "test preparation course",
        "math score",
        "reading score",
        "writing score",
    ]
    h, body = pick_cols(header, rows, names)
    mp = {
        "gender": "성별",
        "race/ethnicity": "인종그룹",
        "parental level of education": "부모최종학력",
        "lunch": "급식유형",
        "test preparation course": "시험준비여부",
        "math score": "수학점수",
        "reading score": "읽기점수",
        "writing score": "쓰기점수",
    }
    h = rename_header(h, mp)
    body = strip_rows(h, body)
    body = drop_rows_missing_in(h, body, ["성별", "수학점수", "읽기점수", "쓰기점수"])
    nb: list[list[str]] = []
    for r in body:
        try:
            nb.append(
                r[:5]
                + [str(int(float(r[5]))), str(int(float(r[6]))), str(int(float(r[7])))]
            )
        except (ValueError, IndexError):
            continue
    body = sample_rows(nb, max_rows)
    note = "결측: 핵심 점수·성별 없는 행 삭제. 점수는 정수로 통일."
    return h, body, note


def process_student_mat_g2(rows: list[list[str]], header: list[str], max_rows: int | None):
    cols = ["sex", "age", "studytime", "failures", "goout", "G3"]
    h, body = pick_cols(header, rows, cols)
    mp = {
        "sex": "성별",
        "age": "나이",
        "studytime": "공부시간_범주",
        "failures": "과락과목수",
        "goout": "외출빈도",
        "G3": "기말성적",
    }
    h = rename_header(h, mp)
    body = strip_rows(h, body)
    body = drop_rows_missing_in(h, body, list(mp.values()))
    nb = []
    for r in body:
        try:
            nb.append([r[0], str(int(float(r[1]))), r[2], str(int(float(r[3]))), r[4], str(int(float(r[5])))])
        except (ValueError, IndexError):
            continue
    body = sample_rows(nb, max_rows)
    note = "2학년용: 핵심 변수만. 결측 행 삭제."
    return h, body, note


def process_student_mat_g3(rows: list[list[str]], header: list[str], max_rows: int | None):
    cols = [
        "sex",
        "age",
        "Medu",
        "Fedu",
        "studytime",
        "failures",
        "absences",
        "goout",
        "health",
        "G1",
        "G2",
        "G3",
    ]
    h, body = pick_cols(header, rows, cols)
    mp = {
        "sex": "성별",
        "age": "나이",
        "Medu": "어머니학력코드",
        "Fedu": "아버지학력코드",
        "studytime": "공부시간_범주",
        "failures": "과락과목수",
        "absences": "결석일수",
        "goout": "외출빈도",
        "health": "건강상태",
        "G1": "1학기성적",
        "G2": "2학기성적",
        "G3": "기말성적",
    }
    h = rename_header(h, mp)
    body = strip_rows(h, body)
    body = drop_rows_missing_in(h, body, ["성별", "나이", "기말성적"])
    nb = []
    for r in body:
        try:
            nb.append(
                [
                    r[0],
                    str(int(float(r[1]))),
                    str(int(float(r[2]))),
                    str(int(float(r[3]))),
                    str(int(float(r[4]))),
                    str(int(float(r[5]))),
                    str(int(float(r[6]))),
                    str(int(float(r[7]))),
                    str(int(float(r[8]))),
                    str(int(float(r[9]))),
                    str(int(float(r[10]))),
                    str(int(float(r[11]))),
                ]
            )
        except (ValueError, IndexError):
            continue
    body = sample_rows(nb, max_rows)
    note = "3학년용: 범주(성별·학력코드)·수치 혼합. 결측은 핵심 열 기준 삭제."
    return h, body, note


def process_sleep(rows: list[list[str]], header: list[str], max_rows: int | None):
    mp = {
        "Person ID": "응답자ID",
        "Gender": "성별",
        "Age": "나이",
        "Occupation": "직업",
        "Sleep Duration": "수면시간_시간",
        "Quality of Sleep": "수면질_점수",
        "Physical Activity Level": "신체활동_점수",
        "Stress Level": "스트레스_점수",
        "BMI Category": "BMI구분",
        "Blood Pressure": "혈압_문자열",
        "Heart Rate": "심박수",
        "Daily Steps": "일일걸음수",
        "Sleep Disorder": "수면장애유형",
    }
    h = rename_header(header, mp)
    body = strip_rows(h, rows)
    body = drop_rows_missing_in(
        h,
        body,
        ["성별", "나이", "수면시간_시간", "수면질_점수", "스트레스_점수", "일일걸음수"],
    )
    nb = []
    for r in body:
        try:
            nb.append(
                [
                    r[0],
                    r[1],
                    str(float(r[2])),
                    r[3],
                    str(float(r[4])),
                    str(float(r[5])),
                    str(float(r[6])),
                    str(float(r[7])),
                    r[8],
                    r[9],
                    str(float(r[10])),
                    str(float(r[11])),
                    r[12],
                ]
            )
        except (ValueError, IndexError):
            continue
    body = sample_rows(nb, max_rows)
    note = "결측: 분석에 자주 쓰는 수치·성별 등 비어 있으면 행 삭제."
    return h, body, note


def process_air_quality(rows: list[list[str]], header: list[str], max_rows: int | None):
    mp = {
        "City": "도시",
        "Date": "날짜",
        "PM2.5": "PM25",
        "PM10": "PM10",
        "NO": "NO",
        "NO2": "NO2",
        "NOx": "NOx",
        "NH3": "NH3",
        "CO": "CO",
        "SO2": "SO2",
        "O3": "O3",
        "Benzene": "벤젠",
        "Toluene": "톨루엔",
        "Xylene": "자일렌",
        "AQI": "AQI",
        "AQI_Bucket": "AQI등급",
    }
    h = rename_header(header, mp)
    body = strip_rows(h, rows)
    h, body = drop_sparse_columns(h, body, 0.82)
    numeric_cols = [c for c in h if c not in {"도시", "날짜"}]

    def at_least_one_num(r: list[str]) -> bool:
        for name in numeric_cols:
            j = h.index(name)
            if j < len(r) and not is_empty(r[j]):
                return True
        return False

    body = [r for r in body if not is_empty(r[h.index("도시")]) and not is_empty(r[h.index("날짜")]) and at_least_one_num(r)]
    body = sample_rows(body, max_rows)
    note = "결측: 공기질 지표 중 하나 이상 있는 행만 유지. 결측 비율 82% 초과 열 제거."
    return h, body, note


def process_world_happiness(rows: list[list[str]], header: list[str], max_rows: int | None):
    mp = {
        "Overall rank": "행복순위",
        "Country or region": "국가명",
        "Score": "행복점수",
        "GDP per capita": "1인당GDP",
        "Social support": "사회적지지",
        "Healthy life expectancy": "건강기대수명",
        "Freedom to make life choices": "선택의자유",
        "Generosity": "관대함",
        "Perceptions of corruption": "부패인식",
    }
    h = rename_header(header, mp)
    body = strip_rows(h, rows)
    body = drop_rows_missing_in(h, body, ["국가명", "행복점수"])
    body = sample_rows(body, max_rows)
    note = "결측: 국가명·행복점수 없는 행 삭제."
    return h, body, note


def process_superstore(
    rows: list[list[str]], header: list[str], max_rows: int | None, g2: bool
):
    if g2:
        cols = ["Category", "Region", "Sales", "Quantity", "Profit"]
        h, body = pick_cols(header, rows, cols)
        mp = {
            "Category": "제품대분류",
            "Region": "지역",
            "Sales": "매출액",
            "Quantity": "수량",
            "Profit": "이익",
        }
    else:
        cols = [
            "Segment",
            "Category",
            "Sub-Category",
            "Region",
            "Sales",
            "Quantity",
            "Discount",
            "Profit",
        ]
        h, body = pick_cols(header, rows, cols)
        mp = {
            "Segment": "고객세그먼트",
            "Category": "제품대분류",
            "Sub-Category": "제품소분류",
            "Region": "지역",
            "Sales": "매출액",
            "Quantity": "수량",
            "Discount": "할인율",
            "Profit": "이익",
        }
    h = rename_header(h, mp)
    body = strip_rows(h, body)
    req = ["제품대분류", "지역", "매출액"]
    body = drop_rows_missing_in(h, body, req)
    nb = []
    for r in body:
        try:
            if g2:
                nb.append([r[0], r[1], str(float(r[2])), str(float(r[3])), str(float(r[4]))])
            else:
                nb.append(
                    [
                        r[0],
                        r[1],
                        r[2],
                        r[3],
                        str(float(r[4])),
                        str(float(r[5])),
                        str(float(r[6])),
                        str(float(r[7])),
                    ]
                )
        except (ValueError, IndexError):
            continue
    body = sample_rows(nb, max_rows)
    note = "ID·고객명 등 식별자 제거. 매출·수량·이익은 숫자형."
    return h, body, note


def process_netflix(rows: list[list[str]], header: list[str], max_rows: int | None, g2: bool):
    if g2:
        cols = ["type", "country", "release_year", "rating", "duration"]
        h, body = pick_cols(header, rows, cols)
        mp = {
            "type": "유형",
            "country": "국가",
            "release_year": "공개연도",
            "rating": "관람등급",
            "duration": "길이",
        }
    else:
        cols = ["type", "title", "director", "country", "release_year", "rating", "duration", "listed_in"]
        h, body = pick_cols(header, rows, cols)
        mp = {
            "type": "유형",
            "title": "제목",
            "director": "감독",
            "country": "국가",
            "release_year": "공개연도",
            "rating": "관람등급",
            "duration": "길이",
            "listed_in": "장르태그",
        }
    h = rename_header(h, mp)
    body = strip_rows(h, body)
    body = drop_rows_missing_in(h, body, ["유형", "공개연도"])
    nb = []
    for r in body:
        try:
            yr = str(int(float(r[h.index("공개연도")])))
            rr = list(r)
            rr[h.index("공개연도")] = yr
            nb.append(rr)
        except (ValueError, IndexError):
            continue
    body = sample_rows(nb, max_rows)
    note = "2학년: 제목·장르 생략. 3학년: 장르태그·제목 포함(텍스트 열)."
    return h, body, note


def process_usvideos(rows: list[list[str]], header: list[str], max_rows: int | None):
    mp = {
        "video_id": "동영상ID",
        "trending_date": "트렌드날짜",
        "title": "제목",
        "channel_title": "채널명",
        "category_id": "카테고리ID",
        "publish_time": "게시시각",
        "views": "조회수",
        "likes": "좋아요수",
        "dislikes": "싫어요수",
        "comment_count": "댓글수",
        "comments_disabled": "댓글비활성",
        "ratings_disabled": "평점비활성",
        "video_error_or_removed": "오류또는삭제",
    }
    h = rename_header(header, mp)
    body = strip_rows(h, rows)
    body = drop_rows_missing_in(h, body, ["조회수", "좋아요수", "카테고리ID"])
    nb = []
    for r in body:
        try:
            idxs = [h.index("조회수"), h.index("좋아요수"), h.index("싫어요수"), h.index("댓글수")]
            vals = [str(int(float(r[i]))) for i in idxs]
            nr = list(r)
            for i, v in zip(idxs, vals):
                nr[i] = v
            nb.append(nr)
        except (ValueError, IndexError):
            continue
    body = sample_rows(nb, max_rows)
    note = "긴 설명·태그 열은 원본 정리 단계에서 제거됨. 수치 열 정수화."
    return h, body, note


def process_500_person(rows: list[list[str]], header: list[str], max_rows: int | None):
    mp = {"Gender": "성별", "Height": "키_cm", "Weight": "몸무게_kg", "Index": "체형지수등급"}
    h = rename_header(header, mp)
    body = strip_rows(h, rows)
    body = drop_rows_missing_in(h, body, list(mp.values()))
    nb = []
    for r in body:
        try:
            nb.append([r[0], str(float(r[1])), str(float(r[2])), str(int(float(r[3])))])
        except (ValueError, IndexError):
            continue
    body = sample_rows(nb, max_rows)
    note = "결측 행 삭제. 등급은 데이터셋 정의에 따른 범주."
    return h, body, note


def process_heart(rows: list[list[str]], header: list[str], max_rows: int | None, g2: bool):
    if g2:
        cols = ["age", "sex", "trestbps", "chol", "thalach", "target"]
        h, body = pick_cols(header, rows, cols)
        mp = {
            "age": "나이",
            "sex": "성별코드",
            "trestbps": "안정시혈압",
            "chol": "콜레스테롤",
            "thalach": "최대심박수",
            "target": "심장질환여부코드",
        }
    else:
        h = list(header)
        body = [list(r) for r in rows]
        mp = {
            "age": "나이",
            "sex": "성별코드",
            "cp": "흉통유형코드",
            "trestbps": "안정시혈압",
            "chol": "콜레스테롤",
            "fbs": "공복혈당이상",
            "restecg": "안정심전도",
            "thalach": "최대심박수",
            "exang": "운동유발협심증",
            "oldpeak": "ST우울",
            "slope": "ST기울기",
            "ca": "주요혈관수",
            "thal": "thal코드",
            "target": "심장질환여부코드",
        }
    h = rename_header(h, mp)
    body = strip_rows(h, body)
    req = ["나이", "콜레스테롤", "심장질환여부코드"] if not g2 else ["나이", "콜레스테롤", "심장질환여부코드"]
    body = drop_rows_missing_in(h, body, req)
    h_g2 = ["나이", "성별", "안정시혈압", "콜레스테롤", "최대심박수", "심장질환여부"]
    nb = []
    for r in body:
        try:
            if g2:
                sex_ko = heart_sex_label(r[1])
                tg_ko = heart_target_label(r[5])
                nb.append(
                    [
                        str(int(float(r[0]))),
                        sex_ko,
                        str(float(r[2])),
                        str(float(r[3])),
                        str(float(r[4])),
                        tg_ko,
                    ]
                )
            else:
                nr = [str(int(float(r[0]))), heart_sex_label(r[1])]
                for i in range(2, len(r) - 1):
                    nr.append(str(float(r[i])))
                nr.append(heart_target_label(r[-1]))
                nb.append(nr)
        except (ValueError, IndexError):
            continue
    if g2:
        h = h_g2
    elif nb:
        h = list(h)
        h[1] = "성별"
        h[-1] = "심장질환여부"
    body = sample_rows(nb, max_rows)
    note = "의료 코드 데이터셋. 2학년: 핵심 변수만·성별·질환 한글 라벨. 3학년: 대부분 UCI 수치코드, 성별·질환만 한글."
    return h, body, note


def process_uber(rows: list[list[str]], header: list[str], max_rows: int | None):
    mp = {
        "dispatching_base_number": "배차기지코드",
        "date": "날짜",
        "active_vehicles": "활성차량수",
        "trips": "운행건수",
    }
    h = rename_header(header, mp)
    body = strip_rows(h, rows)
    body = drop_rows_missing_in(h, body, list(mp.values()))
    nb = []
    for r in body:
        try:
            nb.append([r[0], r[1], str(int(float(r[2]))), str(int(float(r[3])))])
        except (ValueError, IndexError):
            continue
    body = sample_rows(nb, max_rows)
    note = "시계열·막대 그래프에 적합. 결측 행 삭제."
    return h, body, note


def process_titanic(rows: list[list[str]], header: list[str], max_rows: int | None, g2: bool):
    if g2:
        cols = ["Pclass", "Sex", "Age", "Fare", "Survived"]
        h, body = pick_cols(header, rows, cols)
        mp = {
            "Pclass": "객실등급",
            "Sex": "성별",
            "Age": "나이",
            "Fare": "운임",
            "Survived": "생존",
        }
    else:
        cols = ["Pclass", "Sex", "Age", "SibSp", "Parch", "Fare", "Embarked", "Survived"]
        h, body = pick_cols(header, rows, cols)
        mp = {
            "Pclass": "객실등급",
            "Sex": "성별",
            "Age": "나이",
            "SibSp": "형제배우자수",
            "Parch": "부모자녀수",
            "Fare": "운임",
            "Embarked": "승선항",
            "Survived": "생존",
        }
    h = rename_header(h, mp)
    body = strip_rows(h, body)
    body = drop_rows_missing_in(h, body, [c for c in h if c != "승선항"])
    nb = []
    for r in body:
        try:
            if g2:
                surv = "생존" if r[4] in {"1", "1.0"} else "사망"
                nb.append(
                    [
                        str(int(float(r[0]))),
                        "남성" if r[1] == "male" else "여성",
                        str(float(r[2])),
                        str(float(r[3])),
                        surv,
                    ]
                )
            else:
                emb = r[6] if not is_empty(r[6]) else "미상"
                surv = "생존" if r[7] in {"1", "1.0"} else "사망"
                nb.append(
                    [
                        str(int(float(r[0]))),
                        "남성" if r[1] == "male" else "여성",
                        str(float(r[2])),
                        str(int(float(r[3]))),
                        str(int(float(r[4]))),
                        str(float(r[5])),
                        emb,
                        surv,
                    ]
                )
        except (ValueError, IndexError):
            continue
    if g2:
        h = ["객실등급", "성별", "나이", "운임", "생존여부"]
    else:
        h = ["객실등급", "성별", "나이", "형제배우자수", "부모자녀수", "운임", "승선항", "생존여부"]
    body = sample_rows(nb, max_rows)
    note = "이름·티켓·객실번호 제거. 나이 결측 행 삭제. 3학년: 승선항 결측은 '미상'."
    return h, body, note


def process_iris(rows: list[list[str]], header: list[str], max_rows: int | None):
    mp = {
        "Id": "표본번호",
        "SepalLengthCm": "꽃받침길이_cm",
        "SepalWidthCm": "꽃받침너비_cm",
        "PetalLengthCm": "꽃잎길이_cm",
        "PetalWidthCm": "꽃잎너비_cm",
        "Species": "품종",
    }
    h = rename_header(header, mp)
    body = strip_rows(h, rows)
    body = drop_rows_missing_in(h, body, ["품종", "꽃받침길이_cm"])
    nb = []
    for r in body:
        try:
            nb.append(
                [
                    str(int(float(r[0]))),
                    str(float(r[1])),
                    str(float(r[2])),
                    str(float(r[3])),
                    str(float(r[4])),
                    norm_cell(r[5]).replace("Iris-", ""),
                ]
            )
        except (ValueError, IndexError):
            continue
    body = sample_rows(nb, max_rows)
    note = "품종명에서 접두어 정리. 산점도·박스플롯에 적합."
    return h, body, note


def process_penguins(rows: list[list[str]], header: list[str], max_rows: int | None):
    mp = {
        "species": "펭귄종",
        "island": "서식섬",
        "bill_length_mm": "부리길이_mm",
        "bill_depth_mm": "부리깊이_mm",
        "flipper_length_mm": "날개길이_mm",
        "body_mass_g": "체중_g",
        "sex": "성별",
    }
    h = rename_header(header, mp)
    body = strip_rows(h, rows)
    body = drop_rows_missing_in(h, body, ["펭귄종", "부리길이_mm", "체중_g", "성별"])
    nb = []
    for r in body:
        try:
            nb.append(
                [
                    r[0],
                    r[1],
                    str(float(r[2])),
                    str(float(r[3])),
                    str(float(r[4])),
                    str(float(r[5])),
                    r[6].upper() if r[6] else "",
                ]
            )
        except (ValueError, IndexError):
            continue
    body = sample_rows(nb, max_rows)
    note = "결측(원본 .) 행 삭제. 두 집단·산포 분석에 적합."
    return h, body, note


def process_tips(rows: list[list[str]], header: list[str], max_rows: int | None):
    mp = {
        "total_bill": "총액_달러",
        "tip": "팁_달러",
        "sex": "성별",
        "smoker": "흡연여부",
        "day": "요일",
        "time": "시간대",
        "size": "인원수",
    }
    h = rename_header(header, mp)
    body = strip_rows(h, rows)
    body = drop_rows_missing_in(h, body, list(mp.values()))
    nb = []
    for r in body:
        try:
            nb.append(
                [
                    str(float(r[0])),
                    str(float(r[1])),
                    "여성" if "Female" in r[2] else "남성",
                    r[3],
                    r[4],
                    r[5],
                    str(int(float(r[6]))),
                ]
            )
        except (ValueError, IndexError):
            continue
    body = sample_rows(nb, max_rows)
    note = "범주형+연속형 혼합. 그룹 비교·상관에 적합."
    return h, body, note


def process_flights(rows: list[list[str]], header: list[str], max_rows: int | None):
    month_map = {
        "January": "1",
        "February": "2",
        "March": "3",
        "April": "4",
        "May": "5",
        "June": "6",
        "July": "7",
        "August": "8",
        "September": "9",
        "October": "10",
        "November": "11",
        "December": "12",
    }
    mp = {"year": "연도", "month": "월_영문", "passengers": "승객수_천명"}
    h = rename_header(header, mp)
    body = strip_rows(h, rows)
    body = drop_rows_missing_in(h, body, ["연도", "월_영문", "승객수_천명"])
    nb = []
    for r in body:
        try:
            m_en = r[1]
            m_num = month_map.get(m_en, "")
            nb.append([str(int(float(r[0]))), m_num, m_en, str(int(float(r[2])))])
        except (ValueError, IndexError):
            continue
    h = ["연도", "월_번호", "월_영문", "승객수_천명"]
    body = sample_rows(nb, max_rows)
    note = "시계열 꺾은선·계절성 설명에 적합."
    return h, body, note


def process_diamonds(rows: list[list[str]], header: list[str], max_rows: int | None, g2: bool):
    if g2:
        cols = ["carat", "cut", "color", "clarity", "price"]
        h, body = pick_cols(header, rows, cols)
        mp = {
            "carat": "캐럿",
            "cut": "컷등급",
            "color": "색상등급",
            "clarity": "선명도등급",
            "price": "가격_달러",
        }
        h = rename_header(h, mp)
    else:
        h0 = [norm_cell(x).strip('"') for x in header]
        body0 = [[norm_cell(c).strip('"') for c in row] for row in rows]
        mp = {
            "carat": "캐럿",
            "cut": "컷등급",
            "color": "색상등급",
            "clarity": "선명도등급",
            "depth": "깊이_퍼센트",
            "table": "테이블_퍼센트",
            "price": "가격_달러",
            "x": "길이_mm",
            "y": "너비_mm",
            "z": "높이_mm",
        }
        h = rename_header(h0, mp)
        body = body0
    body = strip_rows(h, body)
    req = ["캐럿", "가격_달러"] if g2 else ["캐럿", "가격_달러", "컷등급"]
    body = drop_rows_missing_in(h, body, req)
    nb = []
    for r in body:
        try:
            if g2:
                nb.append([str(float(r[0])), r[1], r[2], r[3], str(int(float(r[4])))])
            else:
                nb.append(
                    [
                        str(float(r[0])),
                        r[1],
                        r[2],
                        r[3],
                        str(float(r[4])),
                        str(float(r[5])),
                        str(int(float(r[6]))),
                        str(float(r[7])),
                        str(float(r[8])),
                        str(float(r[9])),
                    ]
                )
        except (ValueError, IndexError):
            continue
    body = sample_rows(nb, max_rows)
    note = "2학년: 가격·4C 요약. 3학년: 치수·깊이 포함."
    return h, body, note


def process_exercise(rows: list[list[str]], header: list[str], max_rows: int | None):
    if header and is_empty(header[0]):
        header = header[1:]
        rows = [r[1:] if len(r) > 1 else r for r in rows]
    mp = {"id": "참가자ID", "diet": "식이구분", "pulse": "맥박", "time": "측정시점", "kind": "운동종류"}
    h = rename_header(header, mp)
    body = strip_rows(h, rows)
    body = drop_rows_missing_in(h, body, ["맥박", "측정시점", "운동종류"])
    nb = []
    for r in body:
        try:
            nb.append([str(int(float(r[0]))), r[1], str(float(r[2])), r[3], r[4]])
        except (ValueError, IndexError):
            continue
    body = sample_rows(nb, max_rows)
    note = "반복측정 구조. 집단 비교·시간에 따른 변화 설명 가능."
    return h, body, note


def process_mpg(rows: list[list[str]], header: list[str], max_rows: int | None):
    mp = {
        "mpg": "연비_mpg",
        "cylinders": "기통수",
        "displacement": "배기량",
        "horsepower": "마력",
        "weight": "중량_lb",
        "acceleration": "가속도",
        "model_year": "모델연도",
        "origin": "제조지역코드",
        "name": "차량명",
    }
    h = rename_header(header, mp)
    body = strip_rows(h, rows)
    origin_map = {"1": "미국", "2": "유럽", "3": "일본", "1.0": "미국", "2.0": "유럽", "3.0": "일본"}
    nb = []
    for r in body:
        if len(r) < len(h):
            r = r + [""] * (len(h) - len(r))
        if is_empty(r[h.index("연비_mpg")]):
            continue
        hp = r[h.index("마력")]
        if is_empty(hp) or not re.match(r"^-?\d", norm_cell(hp)):
            continue
        try:
            o = norm_cell(r[h.index("제조지역코드")])
            o_ko = origin_map.get(o, o)
            nb.append(
                [
                    str(float(r[h.index("연비_mpg")])),
                    str(int(float(r[h.index("기통수")]))),
                    str(float(r[h.index("배기량")])),
                    str(float(r[h.index("마력")])),
                    str(float(r[h.index("중량_lb")])),
                    str(float(r[h.index("가속도")])),
                    str(int(float(r[h.index("모델연도")]))),
                    o_ko,
                    norm_cell(r[h.index("차량명")])[:40],
                ]
            )
        except (ValueError, IndexError):
            continue
    h = [
        "연비_mpg",
        "기통수",
        "배기량",
        "마력",
        "중량_lb",
        "가속도",
        "모델연도",
        "제조지역",
        "차량명_요약",
    ]
    body = sample_rows(nb, max_rows)
    note = "마력 결측·비숫자 행 삭제. 제조지역 코드→한글. 차량명은 40자까지."
    return h, body, note


def dispatch(name: str, rows, header, g2: bool) -> tuple[list[str], list[list[str]], str]:
    limits_g2 = {
        "04 Air Quality Data in India.csv": 1800,
        "07 Superstore.csv": 2000,
        "08 netflix_titles.csv": 2000,
        "09 USvideos.csv": 2000,
        "19 diamonds.csv": 2000,
    }
    limits_g3 = {
        "04 Air Quality Data in India.csv": 8000,
        "07 Superstore.csv": 5000,
        "08 netflix_titles.csv": 3500,
        "09 USvideos.csv": 3000,
        "19 diamonds.csv": 10000,
    }
    lim = (limits_g2 if g2 else limits_g3).get(name)

    if name == "01 StudentsPerformance.csv":
        return process_students_performance(rows, header, lim or 1000)
    if name == "02 student-mat.csv":
        return process_student_mat_g2(rows, header, lim or 500) if g2 else process_student_mat_g3(rows, header, lim or 395)
    if name == "03 Sleep_health_and_lifestyle_dataset.csv":
        return process_sleep(rows, header, lim or 400)
    if name == "04 Air Quality Data in India.csv":
        return process_air_quality(rows, header, lim)
    if name == "06 World Happiness Report 2019.csv":
        return process_world_happiness(rows, header, lim or 200)
    if name == "07 Superstore.csv":
        return process_superstore(rows, header, lim, g2=True) if g2 else process_superstore(rows, header, lim, g2=False)
    if name == "08 netflix_titles.csv":
        return process_netflix(rows, header, lim, g2=True) if g2 else process_netflix(rows, header, lim, g2=False)
    if name == "09 USvideos.csv":
        return process_usvideos(rows, header, lim)
    if name == "10 500_Person_Gender_Height_Weight_Index.csv":
        return process_500_person(rows, header, lim or 500)
    if name == "11 heart.csv":
        return process_heart(rows, header, lim or 900, g2=True) if g2 else process_heart(rows, header, lim or 900, g2=False)
    if name == "12 Uber-Jan-Feb-FOIL.csv":
        return process_uber(rows, header, lim or 400)
    if name == "14 titanic.csv":
        return process_titanic(rows, header, lim or 891, g2=True) if g2 else process_titanic(rows, header, lim or 891, g2=False)
    if name == "15 Iris.csv":
        return process_iris(rows, header, lim or 200)
    if name == "16 penguins.csv":
        return process_penguins(rows, header, lim or 400)
    if name == "17 tips.csv":
        return process_tips(rows, header, lim or 300)
    if name == "18 flights.csv":
        return process_flights(rows, header, lim or 200)
    if name == "19 diamonds.csv":
        return process_diamonds(rows, header, lim, g2=True) if g2 else process_diamonds(rows, header, lim, g2=False)
    if name == "20 exercise.csv":
        return process_exercise(rows, header, lim or 200)
    if name == "21 mpg.csv":
        return process_mpg(rows, header, lim or 400)
    raise ValueError(f"알 수 없는 파일: {name}")


# 원본(dataset/루트) 파일명 → 학년 폴더에 쓸 파일명 (01~19 연속 번호)
SOURCE_TO_OUTPUT: list[tuple[str, str]] = [
    ("01 StudentsPerformance.csv", "01_학생시험점수.csv"),
    ("02 student-mat.csv", "02_포르투갈학생성적.csv"),
    ("03 Sleep_health_and_lifestyle_dataset.csv", "03_수면건강.csv"),
    ("04 Air Quality Data in India.csv", "04_인도대기질.csv"),
    ("06 World Happiness Report 2019.csv", "05_세계행복.csv"),
    ("07 Superstore.csv", "06_슈퍼스토어.csv"),
    ("08 netflix_titles.csv", "07_넷플릭스.csv"),
    ("09 USvideos.csv", "08_유튜브트렌드.csv"),
    ("10 500_Person_Gender_Height_Weight_Index.csv", "09_키몸무게체형.csv"),
    ("11 heart.csv", "10_심장질환.csv"),
    ("12 Uber-Jan-Feb-FOIL.csv", "11_우버운행.csv"),
    ("14 titanic.csv", "12_타이타닉.csv"),
    ("15 Iris.csv", "13_붓꽃.csv"),
    ("16 penguins.csv", "14_펭귄.csv"),
    ("17 tips.csv", "15_식당팁.csv"),
    ("18 flights.csv", "16_항공승객.csv"),
    ("19 diamonds.csv", "17_다이아몬드.csv"),
    ("20 exercise.csv", "18_운동맥박.csv"),
    ("21 mpg.csv", "19_자동차연비.csv"),
]


def clear_grade_output_csvs(out_dir: Path) -> None:
    if not out_dir.is_dir():
        return
    for p in out_dir.glob("*.csv"):
        p.unlink()


def main() -> None:
    clear_grade_output_csvs(OUT_G2)
    clear_grade_output_csvs(OUT_G3)

    summaries: list[dict[str, str]] = []
    for src_name, out_name in SOURCE_TO_OUTPUT:
        path = SRC_DIR / src_name
        if not path.is_file():
            print(f"[건너뜀] 원본 없음: {src_name}")
            continue
        name = path.name
        header, rows = read_table(path)
        if not header:
            continue

        for g2, out_dir in ((True, OUT_G2), (False, OUT_G3)):
            label = "2학년" if g2 else "3학년"
            try:
                h, body, note = dispatch(name, rows, header, g2=g2)
            except Exception as e:
                print(f"[오류] {name} ({label}): {e}")
                continue
            out_path = out_dir / out_name
            write_table(out_path, h, body)
            summaries.append(
                {
                    "학년": label,
                    "파일명": out_name,
                    "행_수": str(len(body)),
                    "열_수": str(len(h)),
                    "열_이름_요약": " | ".join(h[:6]) + (" …" if len(h) > 6 else ""),
                    "처리_요약": note,
                }
            )
            print(f"{label}  {out_name}  {len(body)}행 × {len(h)}열")

    for od in (OUT_G2, OUT_G3):
        sum_path = od / "_데이터셋_요약.csv"
        fieldnames = ["학년", "파일명", "행_수", "열_수", "열_이름_요약", "처리_요약"]
        with open(sum_path, "w", newline="", encoding=OUT_ENCODING) as f:
            w = csv.DictWriter(f, fieldnames=fieldnames)
            w.writeheader()
            for s in summaries:
                if (s["학년"] == "2학년") == (od == OUT_G2):
                    w.writerow(s)

    notes = """dataset/grade2 · dataset/grade3 안내
================================
- UTF-8(BOM) CSV입니다. 엑셀에서 한글이 깨지면 '데이터 > 텍스트/CSV'로 가져오기 하세요.
- 2학년 수행평가(정보): 출처·데이터 설명·항목(열)·그래프·해석 중심. 열 수를 줄여 보기 쉽게 했습니다.
- 3학년 수행평가(빅데이터분석): 범주형·수치형 구분, 기초통계, 그룹 비교·관계·분포에 쓸 수 있게 열을 더 남겼습니다.
- 결측치는 데이터마다 다릅니다. 파일명은 01~19번이 연속되도록 정리되어 있습니다.
- 원본은 dataset/ 루트 CSV입니다. 재생성: python scripts/prepare_datasets_by_grade.py
"""
    for od in (OUT_G2, OUT_G3):
        (od / "README_DATASETS.txt").write_text(notes, encoding="utf-8")

    print("완료: dataset/grade2, dataset/grade3 및 요약·README 생성")


if __name__ == "__main__":
    main()
