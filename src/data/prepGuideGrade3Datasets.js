/** 3학년 빅데이터 연습 전 대비 가이드 — 데이터 탐색기용 */
export const PREP_GUIDE_DATASETS = [
  { id: 3, title: '수면·건강·라이프스타일', category: '미디어 & 일상생활', method: '데이터 분포, 두 변수 관계', point: '수면 시간과 스트레스의 관계' },
  { id: 7, title: '넷플릭스 콘텐츠 목록', category: '미디어 & 일상생활', method: '데이터 분포, 두 변수 관계', point: '넷플릭스 장르별 연도 추이' },
  { id: 8, title: '유튜브 트렌드 통계', category: '미디어 & 일상생활', method: '데이터 분포, 두 변수 관계', point: '조회수와 좋아요의 상관관계' },
  { id: 15, title: '식당 팁 (Tips)', category: '미디어 & 일상생활', method: '데이터 분포, 두 변수 관계', point: '요일별/성별 식당 팁 차이' },
  { id: 1, title: '학생 시험 성적', category: '교육 & 학교생활', method: '두 집단 비교, 두 변수 관계', point: '부모님 배경/급식에 따른 성적 차이' },
  { id: 2, title: '포르투갈 학생 성적·생활', category: '교육 & 학교생활', method: '두 집단 비교, 두 변수 관계', point: '공부 시간/결석과 성적의 관계' },
  { id: 9, title: '성별·키·몸무게·체형 지수', category: '자연 & 인체', method: '두 집단 비교, 두 변수 관계', point: '키와 몸무게의 산점도 관계' },
  { id: 13, title: '붓꽃(Iris) 분류', category: '자연 & 인체', method: '두 집단 비교, 두 변수 관계', point: '품종별 꽃잎/꽃받침 길이 비교' },
  { id: 14, title: '팔머 펭귄', category: '자연 & 인체', method: '두 집단 비교, 두 변수 관계', point: '펭귄 종별 날개 길이/체중 차이' },
  { id: 10, title: '심장 질환 관련 임상 지표', category: '의료 & 보건', method: '두 집단 비교, 분포 확인', point: '나이/혈압/콜레스테롤에 따른 질환 차이' },
  { id: 18, title: '운동·맥박 실험', category: '의료 & 보건', method: '두 집단 비교, 두 변수 관계', point: '운동 전/후 맥박 변화 비교' },
  { id: 5, title: '세계 행복 보고서 (2019)', category: '비즈니스 & 경제', method: '두 변수 관계, 두 집단 비교', point: 'GDP 지수와 행복 점수의 상관관계' },
  { id: 6, title: '슈퍼스토어 매출', category: '비즈니스 & 경제', method: '두 변수 관계, 두 집단 비교', point: '지역/물품별 매장 매출 비교' },
  { id: 17, title: '다이아몬드 가격', category: '비즈니스 & 경제', method: '두 변수 관계, 두 집단 비교', point: '다이아몬드 컷 등급별 가격 차이' },
  { id: 19, title: '자동차 연비 (MPG)', category: '비즈니스 & 경제', method: '두 변수 관계, 두 집단 비교', point: '자동차 중량/마력과 연비의 상관관계' },
  { id: 4, title: '인도 도시 대기질', category: '사회 & 시계열', method: '데이터 분포(시계열), 집단 비교', point: '도시/날짜별 미세먼지 농도 추이' },
  { id: 11, title: '우버 뉴욕 일별 운행', category: '사회 & 시계열', method: '데이터 분포(시계열), 집단 비교', point: '뉴욕 우버 일별 탑승객 꺾은선 추이' },
  { id: 12, title: '타이타닉 생존 데이터', category: '사회 & 시계열', method: '데이터 분포(시계열), 집단 비교', point: '객실 등급/성별 생존율 비교' },
  { id: 16, title: '항공 국제선 승객 수', category: '사회 & 시계열', method: '데이터 분포(시계열), 집단 비교', point: '월별 항공 승객 수 계절성 확인' },
  { id: 20, title: '미국 주별 교통사고', category: '사회 & 시계열', method: '데이터 분포(시계열), 집단 비교', point: '주별 과속/음주 비율과 교통사고율 관계' },
];

export const PREP_GUIDE_CATEGORIES = [
  '전체',
  '미디어 & 일상생활',
  '교육 & 학교생활',
  '자연 & 인체',
  '의료 & 보건',
  '비즈니스 & 경제',
  '사회 & 시계열',
];

export const PREP_GUIDE_CATEGORY_COLORS = {
  '미디어 & 일상생활': '#f43f5e',
  '교육 & 학교생활': '#3b82f6',
  '자연 & 인체': '#10b981',
  '의료 & 보건': '#06b6d4',
  '비즈니스 & 경제': '#f59e0b',
  '사회 & 시계열': '#8b5cf6',
};
