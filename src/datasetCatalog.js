/**
 * 데이터셋 안내 페이지용 메타데이터.
 * 행·열 수는 prepare_datasets_by_grade.py 기본 출력 기준이며, 스크립트 재실행 시 달라질 수 있습니다.
 */
export const DATASET_CATALOG = [
  {
    file: '01_StudentsPerformance.csv',
    title: '학생 시험 성적',
    blurb:
      '성별, 가정 배경, 급식 유형 등과 수학·읽기·쓰기 점수의 관계를 막대·박스플롯 등으로 살펴보기 좋습니다.',
    g2: { rows: 1000, cols: 8 },
    g3: { rows: 1000, cols: 8 },
  },
  {
    file: '02_student-mat.csv',
    title: '고등학생 성적·생활 (포르투갈)',
    blurb:
      '공부 시간, 결석, 가족 환경과 성적의 관계를 분석하기 위한 교육 통계 데이터입니다.',
    g2: { rows: 395, cols: 6 },
    g3: { rows: 395, cols: 12 },
  },
  {
    file: '03_Sleep_health_and_lifestyle_dataset.csv',
    title: '수면·건강·라이프스타일',
    blurb:
      '수면 시간, 스트레스, 활동량, 직업 등과 수면 질의 관계를 산점도·막대그래프로 다루기 적합합니다.',
    g2: { rows: 374, cols: 13 },
    g3: { rows: 374, cols: 13 },
  },
  {
    file: '04_Air Quality Data in India.csv',
    title: '인도 도시 대기질',
    blurb:
      '도시·날짜별 미세먼지·가스 농도 등 시계열·지역 비교 주제에 활용할 수 있습니다.',
    g2: { rows: 1800, cols: 16 },
    g3: { rows: 7678, cols: 16 },
  },
  {
    file: '06_World Happiness Report 2019.csv',
    title: '세계 행복 보고서 (2019)',
    blurb:
      '국가별 행복 점수와 GDP, 건강, 사회적 지지 등 지표의 관계를 분석하기 좋은 소규모 표입니다.',
    g2: { rows: 156, cols: 9 },
    g3: { rows: 156, cols: 9 },
  },
  {
    file: '07_Superstore.csv',
    title: '슈퍼스토어 매출 (샘플)',
    blurb:
      '제품 분류·지역·매출·이익 등 소매 데이터로 막대·파이·산점도 등을 연습하기 좋습니다.',
    g2: { rows: 2000, cols: 5 },
    g3: { rows: 5000, cols: 8 },
  },
  {
    file: '08_netflix_titles.csv',
    title: '넷플릭스 콘텐츠 목록 (샘플)',
    blurb:
      '영화/시리즈 유형, 국가, 공개 연도, 등급 등을 빈도·트렌드 관점에서 다룰 수 있습니다.',
    g2: { rows: 2000, cols: 5 },
    g3: { rows: 3500, cols: 8 },
  },
  {
    file: '09_USvideos.csv',
    title: '유튜브 트렌드 통계 (샘플)',
    blurb:
      '조회수, 좋아요, 댓글 수 등 수치형 지표와 카테고리·채널의 관계를 분석할 수 있습니다.',
    g2: { rows: 2000, cols: 13 },
    g3: { rows: 3000, cols: 13 },
  },
  {
    file: '10_500_Person_Gender_Height_Weight_Index.csv',
    title: '성별·키·몸무게·체형 지수',
    blurb:
      '키와 몸무게의 관계, 성별에 따른 분포 차이 등 기초 산점도·히스토그램에 적합합니다.',
    g2: { rows: 500, cols: 4 },
    g3: { rows: 500, cols: 4 },
  },
  {
    file: '11_heart.csv',
    title: '심장 질환 관련 임상 지표',
    blurb:
      '나이, 혈압, 콜레스테롤 등과 질환 여부(라벨)를 다루는 의료 분류용 예제입니다. 수치는 병원 기록 코드 체계를 따릅니다.',
    g2: { rows: 900, cols: 6 },
    g3: { rows: 900, cols: 14 },
  },
  {
    file: '12_Uber-Jan-Feb-FOIL.csv',
    title: '우버 뉴욕 일별 운행 (2015년 1~2월)',
    blurb:
      '날짜별 활성 차량 수와 운행 건수로 꺾은선·막대 그래프·추이 설명에 적합합니다.',
    g2: { rows: 354, cols: 4 },
    g3: { rows: 354, cols: 4 },
  },
  {
    file: '14_titanic.csv',
    title: '타이타닉 생존 데이터',
    blurb:
      '객실 등급, 성별, 나이, 운임과 생존 여부의 관계를 집단 비교·막대그래프로 다루기 좋습니다.',
    g2: { rows: 714, cols: 5 },
    g3: { rows: 714, cols: 8 },
  },
  {
    file: '15_Iris.csv',
    title: '붓꽃(Iris) 분류',
    blurb:
      '꽃받침·꽃잎 길이/너비와 품종(범주)의 관계를 산점도·박스플롯으로 보여 주는 고전 예제입니다.',
    g2: { rows: 150, cols: 6 },
    g3: { rows: 150, cols: 6 },
  },
  {
    file: '16_penguins.csv',
    title: '팔머 펭귄',
    blurb:
      '펭귄 종·서식지·부리·날개·체중 등으로 두 집단 비교와 산포 분석을 연습하기 좋습니다.',
    g2: { rows: 333, cols: 7 },
    g3: { rows: 333, cols: 7 },
  },
  {
    file: '17_tips.csv',
    title: '식당 팁 (Tips)',
    blurb:
      '총액, 팁, 성별, 흡연, 요일, 인원 등으로 그룹 비교·상관을 설명하기 적합합니다.',
    g2: { rows: 244, cols: 7 },
    g3: { rows: 244, cols: 7 },
  },
  {
    file: '18_flights.csv',
    title: '항공 국제선 승객 수 (시계열)',
    blurb:
      '연도·월별 승객 수 추이를 꺾은선그래프로 그리고 계절성을 해석하기 좋습니다.',
    g2: { rows: 144, cols: 4 },
    g3: { rows: 144, cols: 4 },
  },
  {
    file: '19_diamonds.csv',
    title: '다이아몬드 가격',
    blurb:
      '캐럿, 컷·색·선명도 등급과 가격의 관계를 산점도·박스플롯으로 분석할 수 있습니다.',
    g2: { rows: 2000, cols: 5 },
    g3: { rows: 10000, cols: 10 },
  },
  {
    file: '20_exercise.csv',
    title: '운동·맥박 실험',
    blurb:
      '운동 종류·식이 구분·측정 시점에 따른 맥박 변화를 반복 측정 구조로 살펴볼 수 있습니다.',
    g2: { rows: 90, cols: 5 },
    g3: { rows: 90, cols: 5 },
  },
  {
    file: '21_mpg.csv',
    title: '자동차 연비 (MPG)',
    blurb:
      '연비, 배기량, 마력, 중량, 제조 지역 등 변수 간 관계와 연비 차이를 분석하기 좋습니다.',
    g2: { rows: 392, cols: 9 },
    g3: { rows: 392, cols: 9 },
  },
];

export function datasetFileUrl(grade, fileName) {
  const base = import.meta.env.BASE_URL || '/';
  const normalized = base.endsWith('/') ? base : `${base}/`;
  return `${normalized}dataset/grade${grade}/${encodeURIComponent(fileName)}`;
}
