/**
 * 데이터셋 안내 페이지용 메타데이터.
 * file: 연습용(practice) 실제 파일명(01~20_…). assessmentFile: 수행평가용(assessment) 파일명(test01~test20_…).
 * g2/g3는 수행평가용 행·열 수, g2Practice/g3Practice는 연습용만 다를 때.
 */
export const DATASET_CATALOG = [
  {
    num: 1,
    file: '01_학생시험점수.csv',
    assessmentFile: 'test01_학생시험점수.csv',
    title: '학생 시험 성적',
    blurb:
      '1번 데이터입니다. 성별, 가정 배경, 급식 유형 등과 수학·읽기·쓰기 점수의 관계를 막대·박스플롯 등으로 살펴보기 좋습니다.',
    source:
      '교육·통계 수업에서 널리 쓰이는 시험 성적 샘플 데이터(Kaggle 등에 “Students Performance in Exams” 등 이름으로 공유). 실제 특정 학교가 아니라 학습용으로 정리된 가상·익명 데이터로 알려진 경우가 많습니다. 상업적 재배포 전 원본 페이지의 라이선스(CC0 등)를 확인하세요.',
    g2: { rows: 1000, cols: 8 },
    g3: { rows: 1000, cols: 8 },
  },
  {
    num: 2,
    file: '02_포르투갈학생성적.csv',
    assessmentFile: 'test02_포르투갈학생성적.csv',
    title: '고등학생 성적·생활 (포르투갈)',
    blurb:
      '2번 데이터입니다. 공부 시간, 결석, 가족 환경과 성적의 관계를 분석하기 위한 교육 통계 자료입니다.',
    source:
      'UCI Machine Learning Repository의 “Student Performance” 계열 데이터로, 포르투갈 중등교육 기관 설문·성적을 바탕으로 한 연구·교육용 공개 데이터입니다. P. Cortez 등의 논문/기술 보고서와 함께 인용되는 경우가 많습니다. 연구·교육 목적 외 사용 시 UCI 및 원 논문의 이용 조건을 따르세요.',
    g2: { rows: 395, cols: 6 },
    g3: { rows: 395, cols: 12 },
  },
  {
    num: 3,
    file: '03_수면건강.csv',
    assessmentFile: 'test03_수면건강.csv',
    title: '수면·건강·라이프스타일',
    blurb:
      '3번 데이터입니다. 수면 시간, 스트레스, 활동량, 직업 등과 수면 질의 관계를 산점도·막대그래프로 다루기 적합합니다.',
    source:
      'Kaggle 등에 “Sleep Health and Lifestyle” 등 이름으로 올라온 건강·라이프스타일 설문형 데이터셋을 바탕으로 한 경우가 많습니다. 출처마다 합성(synthetic) 또는 설문 기반이라는 설명이 붙기도 하므로, “실제 임상 기록”이 아닌 수업용 예제로 이해하는 것이 안전합니다. Kaggle 데이터 페이지의 라이선스를 확인하세요.',
    g2: { rows: 374, cols: 13 },
    g3: { rows: 374, cols: 13 },
  },
  {
    num: 4,
    file: '04_인도대기질.csv',
    assessmentFile: 'test04_인도대기질.csv',
    title: '인도 도시 대기질',
    blurb:
      '4번 데이터입니다. 도시·날짜별 미세먼지·가스 농도 등 시계열·지역 비교 주제에 활용할 수 있습니다.',
    source:
      '인도 공기질 개방 데이터(도시·일별 측정값)를 Kaggle 등에서 가공·배포한 버전에서 가져온 경우가 많습니다. 원천은 정부·환경기관의 공개 측정에 기대지만, 파일마다 연도·지역·결측 처리가 다릅니다. 연구·정책 인용 시에는 원 공공데이터 포털·측정 기관의 공식 자료를 우선 확인하세요.',
    g2: { rows: 416, cols: 16 },
    g3: { rows: 1697, cols: 16 },
    g2Practice: { rows: 1800, cols: 16 },
    g3Practice: { rows: 7678, cols: 16 },
  },
  {
    num: 5,
    file: '05_세계행복.csv',
    assessmentFile: 'test05_세계행복.csv',
    title: '세계 행복 보고서 (2019)',
    blurb:
      '5번 데이터입니다. 국가별 행복 점수와 GDP, 건강, 사회적 지지 등 지표의 관계를 분석하기 좋은 소규모 표입니다.',
    source:
      '세계행복보고서(World Happiness Report)에 실린 지표를 표로 정리한 것으로, Gallup World Poll 등의 설문·통계를 요약한 공개 보고서 기반 데이터입니다. 보고서 연도(여기서는 2019)마다 정의와 표본이 다를 수 있습니다. 상세한 인용·2차 이용은 worldhappiness.report 및 해당 연도 보고서의 안내를 따르세요.',
    g2: { rows: 156, cols: 9 },
    g3: { rows: 156, cols: 9 },
  },
  {
    num: 6,
    file: '06_슈퍼스토어.csv',
    assessmentFile: 'test06_슈퍼스토어.csv',
    title: '슈퍼스토어 매출 (샘플)',
    blurb:
      '6번 데이터입니다. 제품 분류·지역·매출·이익 등 소매 데이터로 막대·파이·산점도 등을 연습하기 좋습니다.',
    source:
      'Tableau 등에서 배포하는 “Superstore” 샘플(가상의 소매 거래 데이터)으로, 실제 기업 데이터가 아닌 BI·교육용 예제입니다. Tableau 및 배포처의 샘플 데이터 이용 약관을 참고하세요.',
    g2: { rows: 2000, cols: 5 },
    g3: { rows: 5000, cols: 8 },
  },
  {
    num: 7,
    file: '07_넷플릭스.csv',
    assessmentFile: 'test07_넷플릭스.csv',
    title: '넷플릭스 콘텐츠 목록 (샘플)',
    blurb:
      '7번 데이터입니다. 영화/시리즈 유형, 국가, 공개 연도, 등급 등을 빈도·트렌드 관점에서 다룰 수 있습니다.',
    source:
      'Kaggle 등에 공유된 넷플릭스 카탈로그 스냅샷(제목·장르·공개일 등)을 기반으로 합니다. 넷플릭스 공식 API/덤프가 아닐 수 있으며, 수집 시점·국가별 카탈로그 차이가 있습니다. 상업적 크롤링·재배포는 서비스 약관과 데이터셋 라이선스를 반드시 확인하세요.',
    g2: { rows: 1808, cols: 5 },
    g3: { rows: 2283, cols: 8 },
    g2Practice: { rows: 2000, cols: 5 },
    g3Practice: { rows: 3500, cols: 8 },
  },
  {
    num: 8,
    file: '08_유튜브트렌드.csv',
    assessmentFile: 'test08_유튜브트렌드.csv',
    title: '유튜브 트렌드 통계 (샘플)',
    blurb:
      '8번 데이터입니다. 조회수, 좋아요, 댓글 수 등 수치형 지표와 카테고리·채널의 관계를 분석할 수 있습니다.',
    source:
      'Kaggle “Trending YouTube Video Statistics” 등: 특정 국가·기간의 유튜브 인기 동영상 메타데이터를 모은 것입니다. Google/YouTube 공식 배포본이 아닐 수 있고, 설명란 등 텍스트는 저작권 보호될 수 있어 수업에서는 수치·범주 위주 활용을 권장합니다.',
    g2: { rows: 2000, cols: 13 },
    g3: { rows: 3000, cols: 13 },
  },
  {
    num: 9,
    file: '09_키몸무게체형.csv',
    assessmentFile: 'test09_키몸무게체형.csv',
    title: '성별·키·몸무게·체형 지수',
    blurb:
      '9번 데이터입니다. 키와 몸무게의 관계, 성별에 따른 분포 차이 등 기초 산점도·히스토그램에 적합합니다.',
    source:
      'Kaggle 등에 올라온 성별·신장·체중·BMI 범주 형태의 일반인 체형 샘플입니다. 출처마다 합성 데이터라고 명시된 경우도 있어, 의학적 진단이 아닌 통계·그래프 연습용으로 쓰는 것이 적절합니다.',
    g2: { rows: 500, cols: 4 },
    g3: { rows: 500, cols: 4 },
  },
  {
    num: 10,
    file: '10_심장질환.csv',
    assessmentFile: 'test10_심장질환.csv',
    title: '심장 질환 관련 임상 지표',
    blurb:
      '10번 데이터입니다. 나이, 혈압, 콜레스테롤 등과 질환 여부(라벨)를 다루는 의료 분류용 예제이며, 수치는 병원 기록 코드 체계를 따릅니다.',
    source:
      'UCI “Heart Disease”(Cleveland 등 병원 기록 기반)로 널리 쓰이는 의료 분류 연습용 공개 데이터입니다. 환자 식별 정보는 제거되었으나, 실제 연구·진단에는 사용할 수 없고 교육·알고리즘 실습 목적에 한합니다. 인용 시 UCI 및 원 논문을 따르세요.',
    g2: { rows: 900, cols: 6 },
    g3: { rows: 900, cols: 14 },
  },
  {
    num: 11,
    file: '11_우버운행.csv',
    assessmentFile: 'test11_우버운행.csv',
    title: '우버 뉴욕 일별 운행 (2015년 1~2월)',
    blurb:
      '11번 데이터입니다. 날짜별 활성 차량 수와 운행 건수로 꺾은선·막대 그래프·추이 설명에 적합합니다.',
    source:
      '뉴욕시 TLC·FOIL 요청 등을 통해 공개된 Uber 운행 집계(일별) 데이터의 일부입니다. 교통·플랫폼 경제 수업에서 자주 쓰이며, 이용 조건은 NYC Open Data / FOIL 배포 문서를 확인하세요.',
    g2: { rows: 354, cols: 4 },
    g3: { rows: 354, cols: 4 },
  },
  {
    num: 12,
    file: '12_타이타닉.csv',
    assessmentFile: 'test12_타이타닉.csv',
    title: '타이타닉 생존 데이터',
    blurb:
      '12번 데이터입니다. 객실 등급, 성별, 나이, 운임과 생존 여부의 관계를 집단 비교·막대그래프로 다루기 좋습니다.',
    source:
      'Kaggle Titanic 대회 등에서 표준화된 1912년 RMS 타이타닉 승객 생존 표입니다. 역사적 사실을 바탕으로 한 공개 요약 표이며, 세부는 박물관·조사 보고서와 다를 수 있습니다. 역사·데이터 윤리를 함께 다루기 좋은 예제입니다.',
    g2: { rows: 714, cols: 5 },
    g3: { rows: 714, cols: 8 },
  },
  {
    num: 13,
    file: '13_붓꽃.csv',
    assessmentFile: 'test13_붓꽃.csv',
    title: '붓꽃(Iris) 분류',
    blurb:
      '13번 데이터입니다. 꽃받침·꽃잎 길이/너비와 품종(범주)의 관계를 산점도·박스플롯으로 보여 주는 고전 예제입니다.',
    source:
      'R.A. Fisher(1936)가 유명하게 사용한 붓꽃(Iris) 측정 데이터. UCI Machine Learning Repository 등에 퍼블릭 도메인으로 공개되어 머신러닝·통계 교과서의 표준 예제입니다.',
    g2: { rows: 150, cols: 6 },
    g3: { rows: 150, cols: 6 },
  },
  {
    num: 14,
    file: '14_펭귄.csv',
    assessmentFile: 'test14_펭귄.csv',
    title: '팔머 펭귄',
    blurb:
      '14번 데이터입니다. 펭귄 종·서식지·부리·날개·체중 등으로 두 집단 비교와 산포 분석을 연습하기 좋습니다.',
    source:
      'Palmer Station, Antarctica 장기 연구에서 수집한 팔머 반도 펭귄(Adélie, Chinstrap, Gentoo) 측정 데이터를 정리한 생태·통계 교육용 데이터입니다. CC0로 배포되는 버전이 많으며, 인용 시 palmerpenguins 패키지/논문(Horst 등, 2020)을 참고하세요.',
    g2: { rows: 333, cols: 7 },
    g3: { rows: 333, cols: 7 },
  },
  {
    num: 15,
    file: '15_식당팁.csv',
    assessmentFile: 'test15_식당팁.csv',
    title: '식당 팁 (Tips)',
    blurb:
      '15번 데이터입니다. 총액, 팁, 성별, 흡연, 요일, 인원 등으로 그룹 비교·상관을 설명하기 적합합니다.',
    source:
      '원래 Bryant(1993) 등에서 소개된 한 식당의 팁·계산서 특성 데이터로, R의 reshape2 등을 거쳐 Seaborn 예제로 널리 쓰입니다. 개인 식별 정보 없는 소규모 표이며, 현재 배포본은 교육·시각화 연습용으로 이해하면 됩니다.',
    g2: { rows: 244, cols: 7 },
    g3: { rows: 244, cols: 7 },
  },
  {
    num: 16,
    file: '16_항공승객.csv',
    assessmentFile: 'test16_항공승객.csv',
    title: '항공 국제선 승객 수 (시계열)',
    blurb:
      '16번 데이터입니다. 연도·월별 승객 수 추이를 꺾은선그래프로 그리고 계절성을 해석하기 좋습니다.',
    source:
      'Box & Jenkins 시계열 분석에서 유명한 국제선 항공 승객 수(AirPassengers) 데이터(1949–1960, 월별). R datasets 등에 포함된 공개 고전 시계열로, 계절성·추세 설명 수업에 자주 쓰입니다.',
    g2: { rows: 144, cols: 4 },
    g3: { rows: 144, cols: 4 },
  },
  {
    num: 17,
    file: '17_다이아몬드.csv',
    assessmentFile: 'test17_다이아몬드.csv',
    title: '다이아몬드 가격',
    blurb:
      '17번 데이터입니다. 캐럿, 컷·색·선명도 등급과 가격의 관계를 산점도·박스플롯으로 분석할 수 있습니다.',
    source:
      'ggplot2(R)에 포함된 다이아몬드 가격·품질 샘플로, 실제 거래 데이터가 아닌 통계·그래프 교육용으로 제공된 예제입니다. 상업적 보석 평가에는 사용하지 않습니다.',
    g2: { rows: 2000, cols: 5 },
    g3: { rows: 10000, cols: 10 },
  },
  {
    num: 18,
    file: '18_운동맥박.csv',
    assessmentFile: 'test18_운동맥박.csv',
    title: '운동·맥박 실험',
    blurb:
      '18번 데이터입니다. 운동 종류·식이 구분·측정 시점에 따른 맥박 변화를 반복 측정 구조로 살펴볼 수 있습니다.',
    source:
      'Seaborn에 포함된 운동·맥박 실험형(반복측정) 예제 데이터로, 인지·생리 실험을 단순화한 교육용 표입니다. 실제 임상 시험이 아닙니다.',
    g2: { rows: 90, cols: 5 },
    g3: { rows: 90, cols: 5 },
  },
  {
    num: 19,
    file: '19_자동차연비.csv',
    assessmentFile: 'test19_자동차연비.csv',
    title: '자동차 연비 (MPG)',
    blurb:
      '19번 데이터입니다. 연비, 배기량, 마력, 중량, 제조 지역 등 변수 간 관계와 연비 차이를 분석하기 좋습니다.',
    source:
      '1983년 StatLib 등에서 널리 인용된 자동차 연비(MPG) 데이터(회귀·시각화 교재용). 일부 값은 결측·수정된 버전이 공유되기도 합니다. 현대 차량 규제·연비와 직접 연결하지 말고 변수 관계 학습용으로 쓰세요.',
    g2: { rows: 392, cols: 9 },
    g3: { rows: 392, cols: 9 },
  },
  {
    num: 20,
    file: '20_미국주교통사고.csv',
    assessmentFile: 'test20_미국주교통사고.csv',
    title: '미국 주별 교통사고 (Seaborn car_crashes)',
    blurb:
      '20번 데이터입니다. Seaborn 내장 예제로, 미국 주(약어)마다 10억 주행마일당 총 사고율·과속·음주 관련 비율·자동차 보험료 등이 있습니다. 막대·산점도·상관을 연습하기 좋습니다.',
    source:
      'Seaborn이 예제로 제공하는 car_crashes로, GitHub mwaskom/seaborn-data에서 배포됩니다. 수치는 미국 주별 교통·보험 관련 공개 요약 통계를 재구성한 교육용 표로 알려져 있으며, 공식 정책 산출물을 대체하지 않습니다. 원본은 BSD-3-Clause(seaborn-data) 등 저장소 라이선스를 따릅니다.',
    g2: { rows: 51, cols: 5 },
    g3: { rows: 51, cols: 8 },
  },
];

/** @typedef {'assessment' | 'practice'} DatasetPurpose */

/** 수행평가용은 assessmentFile( test01_… ), 연습용은 file( 01_… ). */
export function datasetPhysicalFileName(d, purpose) {
  if (purpose === 'assessment' && d.assessmentFile) return d.assessmentFile;
  return d.file;
}

/**
 * @param {2|3} grade
 * @param {string} fileName
 * @param {DatasetPurpose} [purpose]
 */
export function datasetFileUrl(grade, fileName, purpose = 'assessment') {
  const base = import.meta.env.BASE_URL || '/';
  const normalized = base.endsWith('/') ? base : `${base}/`;
  const segment = purpose === 'practice' ? 'practice' : 'assessment';
  return `${normalized}dataset/${segment}/grade${grade}/${encodeURIComponent(fileName)}`;
}

/** @param {object} d 카탈로그 항목 @param {2|3} grade @param {DatasetPurpose} purpose */
export function datasetStatsForPurpose(d, grade, purpose) {
  const key = grade === 2 ? 'g2' : 'g3';
  const pKey = grade === 2 ? 'g2Practice' : 'g3Practice';
  if (purpose === 'practice' && d[pKey] != null) return d[pKey];
  return d[key];
}
