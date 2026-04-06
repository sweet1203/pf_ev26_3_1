/** 2학년 정보 연습 전 대비 가이드 — 데이터 탐색기용 */
export const PREP_GUIDE_GRADE2_DATASETS = [
  { id: 1, title: '학생 시험 성적', category: '교육 & 학교생활', desc: '가정 배경 등과 성적의 관계 (학습용)', rows: '약 1,000행', cols: '8열' },
  { id: 2, title: '포르투갈 학생 성적·생활', category: '교육 & 학교생활', desc: '공부 시간, 결석과 성적의 관계', rows: '약 395행', cols: '6열' },
  { id: 3, title: '수면·건강·라이프스타일', category: '미디어 & 일상생활', desc: '수면 시간, 스트레스 등과 수면 질의 관계', rows: '약 374행', cols: '13열' },
  { id: 4, title: '인도 도시 대기질', category: '사회 & 시계열', desc: '도시/날짜별 미세먼지 농도 (시계열)', rows: '약 1,800행', cols: '16열' },
  { id: 5, title: '세계 행복 보고서 (2019)', category: '비즈니스 & 경제', desc: '국가별 행복 점수와 GDP 등 지표', rows: '약 156행', cols: '9열' },
  { id: 6, title: '슈퍼스토어 매출 (샘플)', category: '비즈니스 & 경제', desc: '제품 분류, 지역, 매출 등 소매 데이터', rows: '약 2,000행', cols: '5열' },
  { id: 7, title: '넷플릭스 콘텐츠 목록', category: '미디어 & 일상생활', desc: '영화/시리즈 유형, 공개 연도 추이', rows: '약 2,000행', cols: '5열' },
  { id: 8, title: '유튜브 트렌드 통계', category: '미디어 & 일상생활', desc: '조회수, 좋아요 등 수치와 카테고리 관계', rows: '약 2,000행', cols: '13열' },
  { id: 9, title: '성별·키·몸무게·체형 지수', category: '자연 & 인체', desc: '키와 몸무게의 관계, 성별 분포 차이', rows: '약 500행', cols: '4열' },
  { id: 10, title: '심장 질환 관련 임상 지표', category: '의료 & 보건', desc: '나이, 혈압 등과 심장 질환 여부 (의료 분류)', rows: '약 900행', cols: '6열' },
  { id: 11, title: '우버 뉴욕 일별 운행', category: '사회 & 시계열', desc: '날짜별 활성 차량 수와 운행 건수', rows: '약 354행', cols: '4열' },
  { id: 12, title: '타이타닉 생존 데이터', category: '사회 & 시계열', desc: '객실 등급, 성별 등과 생존 여부 비교', rows: '약 714행', cols: '5열' },
  { id: 13, title: '붓꽃(Iris) 분류', category: '자연 & 인체', desc: '꽃잎 길이/너비와 품종의 관계 (고전 예제)', rows: '약 150행', cols: '6열' },
  { id: 14, title: '팔머 펭귄', category: '자연 & 인체', desc: '펭귄 종, 부리, 날개, 체중 비교', rows: '약 333행', cols: '7열' },
  { id: 15, title: '식당 팁 (Tips)', category: '미디어 & 일상생활', desc: '총액, 성별, 요일 등에 따른 팁 비교', rows: '약 244행', cols: '7열' },
  { id: 16, title: '항공 국제선 승객 수', category: '사회 & 시계열', desc: '연/월별 승객 수 꺾은선 추이 (시계열)', rows: '약 144행', cols: '4열' },
  { id: 17, title: '다이아몬드 가격', category: '비즈니스 & 경제', desc: '캐럿, 컷 등급과 다이아몬드 가격 관계', rows: '약 2,000행', cols: '5열' },
  { id: 18, title: '운동·맥박 실험', category: '의료 & 보건', desc: '운동 종류, 측정 시점에 따른 맥박 변화', rows: '약 90행', cols: '5열' },
  { id: 19, title: '자동차 연비 (MPG)', category: '비즈니스 & 경제', desc: '마력, 중량, 제조 지역과 연비 분석', rows: '약 392행', cols: '9열' },
  { id: 20, title: '미국 주별 교통사고', category: '사회 & 시계열', desc: '주별 과속, 음주 비율과 총 사고율 상관관계', rows: '약 51행', cols: '5열' },
];

export const PREP_GUIDE_GRADE2_CATEGORIES = [
  '전체',
  '미디어 & 일상생활',
  '교육 & 학교생활',
  '자연 & 인체',
  '의료 & 보건',
  '비즈니스 & 경제',
  '사회 & 시계열',
];

export const PREP_GUIDE_GRADE2_CATEGORY_COLORS = {
  '미디어 & 일상생활': '#ec4899',
  '교육 & 학교생활': '#3b82f6',
  '자연 & 인체': '#10b981',
  '의료 & 보건': '#06b6d4',
  '비즈니스 & 경제': '#f59e0b',
  '사회 & 시계열': '#8b5cf6',
};
