/**
 * 데이터셋 안내 페이지용 메타데이터.
 * 파일명은 01~19번 연속. 행·열 수는 prepare_datasets_by_grade.py 출력 기준.
 */
export const DATASET_CATALOG = [
  {
    num: 1,
    file: '01_학생시험점수.csv',
    title: '학생 시험 성적',
    blurb:
      '1번 데이터입니다. 성별, 가정 배경, 급식 유형 등과 수학·읽기·쓰기 점수의 관계를 막대·박스플롯 등으로 살펴보기 좋습니다.',
    g2: { rows: 1000, cols: 8 },
    g3: { rows: 1000, cols: 8 },
  },
  {
    num: 2,
    file: '02_포르투갈학생성적.csv',
    title: '고등학생 성적·생활 (포르투갈)',
    blurb:
      '2번 데이터입니다. 공부 시간, 결석, 가족 환경과 성적의 관계를 분석하기 위한 교육 통계 자료입니다.',
    g2: { rows: 395, cols: 6 },
    g3: { rows: 395, cols: 12 },
  },
  {
    num: 3,
    file: '03_수면건강.csv',
    title: '수면·건강·라이프스타일',
    blurb:
      '3번 데이터입니다. 수면 시간, 스트레스, 활동량, 직업 등과 수면 질의 관계를 산점도·막대그래프로 다루기 적합합니다.',
    g2: { rows: 374, cols: 13 },
    g3: { rows: 374, cols: 13 },
  },
  {
    num: 4,
    file: '04_인도대기질.csv',
    title: '인도 도시 대기질',
    blurb:
      '4번 데이터입니다. 도시·날짜별 미세먼지·가스 농도 등 시계열·지역 비교 주제에 활용할 수 있습니다.',
    g2: { rows: 1800, cols: 16 },
    g3: { rows: 7678, cols: 16 },
  },
  {
    num: 5,
    file: '05_세계행복.csv',
    title: '세계 행복 보고서 (2019)',
    blurb:
      '5번 데이터입니다. 국가별 행복 점수와 GDP, 건강, 사회적 지지 등 지표의 관계를 분석하기 좋은 소규모 표입니다.',
    g2: { rows: 156, cols: 9 },
    g3: { rows: 156, cols: 9 },
  },
  {
    num: 6,
    file: '06_슈퍼스토어.csv',
    title: '슈퍼스토어 매출 (샘플)',
    blurb:
      '6번 데이터입니다. 제품 분류·지역·매출·이익 등 소매 데이터로 막대·파이·산점도 등을 연습하기 좋습니다.',
    g2: { rows: 2000, cols: 5 },
    g3: { rows: 5000, cols: 8 },
  },
  {
    num: 7,
    file: '07_넷플릭스.csv',
    title: '넷플릭스 콘텐츠 목록 (샘플)',
    blurb:
      '7번 데이터입니다. 영화/시리즈 유형, 국가, 공개 연도, 등급 등을 빈도·트렌드 관점에서 다룰 수 있습니다.',
    g2: { rows: 2000, cols: 5 },
    g3: { rows: 3500, cols: 8 },
  },
  {
    num: 8,
    file: '08_유튜브트렌드.csv',
    title: '유튜브 트렌드 통계 (샘플)',
    blurb:
      '8번 데이터입니다. 조회수, 좋아요, 댓글 수 등 수치형 지표와 카테고리·채널의 관계를 분석할 수 있습니다.',
    g2: { rows: 2000, cols: 13 },
    g3: { rows: 3000, cols: 13 },
  },
  {
    num: 9,
    file: '09_키몸무게체형.csv',
    title: '성별·키·몸무게·체형 지수',
    blurb:
      '9번 데이터입니다. 키와 몸무게의 관계, 성별에 따른 분포 차이 등 기초 산점도·히스토그램에 적합합니다.',
    g2: { rows: 500, cols: 4 },
    g3: { rows: 500, cols: 4 },
  },
  {
    num: 10,
    file: '10_심장질환.csv',
    title: '심장 질환 관련 임상 지표',
    blurb:
      '10번 데이터입니다. 나이, 혈압, 콜레스테롤 등과 질환 여부(라벨)를 다루는 의료 분류용 예제이며, 수치는 병원 기록 코드 체계를 따릅니다.',
    g2: { rows: 900, cols: 6 },
    g3: { rows: 900, cols: 14 },
  },
  {
    num: 11,
    file: '11_우버운행.csv',
    title: '우버 뉴욕 일별 운행 (2015년 1~2월)',
    blurb:
      '11번 데이터입니다. 날짜별 활성 차량 수와 운행 건수로 꺾은선·막대 그래프·추이 설명에 적합합니다.',
    g2: { rows: 354, cols: 4 },
    g3: { rows: 354, cols: 4 },
  },
  {
    num: 12,
    file: '12_타이타닉.csv',
    title: '타이타닉 생존 데이터',
    blurb:
      '12번 데이터입니다. 객실 등급, 성별, 나이, 운임과 생존 여부의 관계를 집단 비교·막대그래프로 다루기 좋습니다.',
    g2: { rows: 714, cols: 5 },
    g3: { rows: 714, cols: 8 },
  },
  {
    num: 13,
    file: '13_붓꽃.csv',
    title: '붓꽃(Iris) 분류',
    blurb:
      '13번 데이터입니다. 꽃받침·꽃잎 길이/너비와 품종(범주)의 관계를 산점도·박스플롯으로 보여 주는 고전 예제입니다.',
    g2: { rows: 150, cols: 6 },
    g3: { rows: 150, cols: 6 },
  },
  {
    num: 14,
    file: '14_펭귄.csv',
    title: '팔머 펭귄',
    blurb:
      '14번 데이터입니다. 펭귄 종·서식지·부리·날개·체중 등으로 두 집단 비교와 산포 분석을 연습하기 좋습니다.',
    g2: { rows: 333, cols: 7 },
    g3: { rows: 333, cols: 7 },
  },
  {
    num: 15,
    file: '15_식당팁.csv',
    title: '식당 팁 (Tips)',
    blurb:
      '15번 데이터입니다. 총액, 팁, 성별, 흡연, 요일, 인원 등으로 그룹 비교·상관을 설명하기 적합합니다.',
    g2: { rows: 244, cols: 7 },
    g3: { rows: 244, cols: 7 },
  },
  {
    num: 16,
    file: '16_항공승객.csv',
    title: '항공 국제선 승객 수 (시계열)',
    blurb:
      '16번 데이터입니다. 연도·월별 승객 수 추이를 꺾은선그래프로 그리고 계절성을 해석하기 좋습니다.',
    g2: { rows: 144, cols: 4 },
    g3: { rows: 144, cols: 4 },
  },
  {
    num: 17,
    file: '17_다이아몬드.csv',
    title: '다이아몬드 가격',
    blurb:
      '17번 데이터입니다. 캐럿, 컷·색·선명도 등급과 가격의 관계를 산점도·박스플롯으로 분석할 수 있습니다.',
    g2: { rows: 2000, cols: 5 },
    g3: { rows: 10000, cols: 10 },
  },
  {
    num: 18,
    file: '18_운동맥박.csv',
    title: '운동·맥박 실험',
    blurb:
      '18번 데이터입니다. 운동 종류·식이 구분·측정 시점에 따른 맥박 변화를 반복 측정 구조로 살펴볼 수 있습니다.',
    g2: { rows: 90, cols: 5 },
    g3: { rows: 90, cols: 5 },
  },
  {
    num: 19,
    file: '19_자동차연비.csv',
    title: '자동차 연비 (MPG)',
    blurb:
      '19번 데이터입니다. 연비, 배기량, 마력, 중량, 제조 지역 등 변수 간 관계와 연비 차이를 분석하기 좋습니다.',
    g2: { rows: 392, cols: 9 },
    g3: { rows: 392, cols: 9 },
  },
];

export function datasetFileUrl(grade, fileName) {
  const base = import.meta.env.BASE_URL || '/';
  const normalized = base.endsWith('/') ? base : `${base}/`;
  return `${normalized}dataset/grade${grade}/${encodeURIComponent(fileName)}`;
}
