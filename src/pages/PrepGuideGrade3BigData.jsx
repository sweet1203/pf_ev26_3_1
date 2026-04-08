import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
  PREP_GUIDE_DATASETS,
  PREP_GUIDE_CATEGORIES,
  PREP_GUIDE_CATEGORY_COLORS,
} from '../data/prepGuideGrade3Datasets.js';
import RiroschoolSubmitNotice from '../components/RiroschoolSubmitNotice.jsx';

ChartJS.register(ArcElement, Tooltip, Legend);

const SECTION_IDS = [
  { id: 'section-intro', label: '홈' },
  { id: 'section-dataset', label: '데이터 선정' },
  { id: 'section-orange', label: 'Orange3 가이드' },
  { id: 'section-ai', label: 'AI 활용법' },
  { id: 'section-rules', label: '유의사항' },
];

export default function PrepGuideGrade3BigData() {
  const [currentCategory, setCurrentCategory] = useState('전체');
  const [activeNav, setActiveNav] = useState('section-intro');

  const filteredDatasets = useMemo(() => {
    if (currentCategory === '전체') return PREP_GUIDE_DATASETS;
    return PREP_GUIDE_DATASETS.filter((d) => d.category === currentCategory);
  }, [currentCategory]);

  const chartData = useMemo(() => {
    const counts = {};
    PREP_GUIDE_DATASETS.forEach((d) => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    const labels = Object.keys(counts);
    return {
      labels,
      datasets: [
        {
          data: labels.map((l) => counts[l]),
          backgroundColor: labels.map((l) => PREP_GUIDE_CATEGORY_COLORS[l] || '#9ca3af'),
          borderWidth: 2,
          borderColor: '#ffffff',
        },
      ],
    };
  }, []);

  const scrollToSection = useCallback((targetId) => {
    const el = document.getElementById(targetId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      let current = 'section-intro';
      for (const { id } of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) current = id;
      }
      setActiveNav(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="antialiased text-stone-800 bg-stone-100 -mx-4 -mt-8 -mb-8 min-h-screen">
      <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 py-3 sm:h-16 sm:py-0">
            <div className="flex items-center">
              <span className="text-2xl mr-2" aria-hidden>
                📊
              </span>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-stone-800">빅데이터 분석 매뉴얼</span>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-x-4 gap-y-1 overflow-x-auto pb-1 sm:pb-0">
              {SECTION_IDS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  data-target={id}
                  onClick={() => {
                    setActiveNav(id);
                    scrollToSection(id);
                  }}
                  className={`px-1 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                    activeNav === id
                      ? 'border-teal-500 text-teal-700 font-bold'
                      : 'border-transparent text-stone-500 hover:text-stone-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-24 pb-24">
        <section id="section-intro" className="scroll-mt-28 pt-4">
          <div className="bg-gradient-to-br from-teal-50 to-stone-100 rounded-3xl p-8 md:p-12 shadow-sm border border-stone-200">
            <h1 className="text-3xl md:text-5xl font-extrabold text-stone-900 mb-6 leading-tight">
              [3학년 빅데이터 분석]
              <br />
              수행평가 1 완벽 대비 가이드
            </h1>
            <p className="text-lg md:text-xl text-stone-600 mb-8 max-w-3xl leading-relaxed">
              이 매뉴얼은 여러분이 20개의 데이터셋 중 가장 적합한 것을 고르고, Orange3를 통해 분석 주제를 확정하며, AI를
              보조 교사로 활용해 수행평가를 준비하기 위한 인터랙티브 가이드입니다.
            </p>
            <div className="inline-flex items-center bg-amber-100 text-amber-800 px-4 py-2 rounded-full font-bold text-sm">
              <span>⚠️</span>
              <span className="ml-2">실제 수행평가 전 반드시 모든 탭을 끝까지 확인하세요!</span>
            </div>
            <p className="mt-6 text-sm text-stone-600">
              연습 CSV·폼으로 넘어가기 전에 이 페이지를 끝까지 읽은 뒤{' '}
              <Link to="/practice/3-bigdata" className="text-teal-700 font-semibold underline hover:text-teal-900">
                3학년 연습 페이지
              </Link>
              로 이동하세요.
            </p>
          </div>
        </section>

        <section id="section-dataset" className="scroll-mt-28">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-stone-900 flex items-center mb-4">
              <span className="text-4xl mr-3">📌</span> STEP 1. 나만의 데이터 선정
            </h2>
            <p className="text-stone-600 text-lg max-w-4xl">
              선생님이 준비한 20개의 데이터셋 중 아무거나 고르지 마세요! 본인의 <strong>관심사(진로)</strong>와{' '}
              <strong>분석 목적</strong>에 맞는 데이터를 골라야 보고서 쓰기가 훨씬 수월해집니다. 아래 탐색기를 통해 나에게
              맞는 데이터를 찾아보세요.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 md:p-8 mb-8">
            <h3 className="text-xl font-bold text-stone-800 mb-4 flex items-center">
              <span className="mr-2">💡</span> 데이터 선택 전 필수 확인 사항
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-stone-50 p-5 rounded-xl border border-stone-100">
                <div className="font-bold text-teal-700 mb-2">1. 나의 관심사와 맞는가?</div>
                <p className="text-stone-600 text-sm">
                  평소 관심 있는 분야를 골라야 궁금증(문항 7번)을 쉽게 작성할 수 있습니다.
                </p>
              </div>
              <div className="bg-stone-50 p-5 rounded-xl border border-stone-100">
                <div className="font-bold text-teal-700 mb-2">2. 변수 유형이 모두 있는가?</div>
                <p className="text-stone-600 text-sm">수행평가 문항 6번을 위해 아래 두 가지가 모두 포함되어야 합니다.</p>
                <ul className="text-sm text-stone-500 mt-2 list-disc pl-5">
                  <li>
                    <strong>범주형:</strong> 글자 형태의 그룹 (예: 성별, 지역)
                  </li>
                  <li>
                    <strong>수치형:</strong> 숫자 형태의 크기 (예: 키, 점수)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h3 className="text-lg font-bold text-stone-800 mb-6 text-center">주제별 데이터 분포</h3>
              <div className="relative w-full max-w-[400px] mx-auto h-[280px] md:h-[320px]">
                <Doughnut
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { boxWidth: 12, font: { size: 11 } },
                      },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => ` ${ctx.label}: ${ctx.raw}개`,
                        },
                      },
                    },
                    cutout: '65%',
                  }}
                />
              </div>
              <p className="text-xs text-center text-stone-400 mt-4">차트 조각을 호버하여 상세 비율을 확인하세요.</p>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 h-full flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h3 className="text-xl font-bold text-stone-800">🗂️ 맞춤형 데이터 탐색기</h3>
                  <div className="flex flex-wrap gap-2">
                    {PREP_GUIDE_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCurrentCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          currentCategory === cat
                            ? 'bg-teal-600 text-white border-teal-600'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div
                  className="grid sm:grid-cols-2 gap-4 flex-grow overflow-y-auto pr-2 max-h-[600px]"
                  id="dataset-grid"
                >
                  {filteredDatasets.length === 0 ? (
                    <div className="col-span-2 text-center py-10 text-stone-500">데이터가 없습니다.</div>
                  ) : (
                    filteredDatasets.map((data) => (
                      <div
                        key={data.id}
                        className="dataset-card bg-stone-50 p-5 rounded-xl border border-stone-200 flex flex-col h-full transition-all hover:-translate-y-1 hover:shadow-md hover:border-teal-500"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="bg-white border border-stone-200 text-stone-600 text-xs px-2 py-1 rounded font-bold">
                            No. {data.id}
                          </span>
                          <span
                            className="text-[10px] font-bold px-2 py-1 rounded-full text-white"
                            style={{ backgroundColor: PREP_GUIDE_CATEGORY_COLORS[data.category] || '#9ca3af' }}
                          >
                            {data.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-stone-800 text-lg mb-2">{data.title}</h4>
                        <div className="mt-auto pt-3 border-t border-stone-200">
                          <div className="text-xs text-stone-500 mb-1">
                            🎯 추천 기법: <span className="font-medium text-stone-700">{data.method}</span>
                          </div>
                          <div className="text-xs text-stone-500 leading-snug">
                            🔍 포인트: <span className="font-medium text-teal-700">{data.point}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-orange" className="scroll-mt-28">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-stone-900 flex items-center mb-4">
              <span className="text-4xl mr-3">🍊</span> STEP 2. Orange3 활용 가이드
            </h2>
            <p className="text-stone-600 text-lg max-w-4xl">
              데이터를 골랐다면, 무작정 질문지에 답을 적기 전에 Orange3를 켜서 데이터의 생김새를 먼저 확인해야 합니다. 아래
              4단계를 순서대로 진행하세요.
            </p>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[
              {
                n: '1',
                t: '데이터 불러오기',
                d: (
                  <>
                    왼쪽 <strong>Data</strong> 범주의 <strong>File</strong>로 CSV를 지정하고, 출력을{' '}
                    <strong>Data Table</strong>에 연결합니다. 결측치(빈칸)와 행·열이 기대와 같은지 확인합니다.
                  </>
                ),
                icon: '📁',
              },
              {
                n: '2',
                t: '기초 통계량 확인',
                d: (
                  <>
                    <strong>Data</strong> 범주의 <strong>Column Statistics</strong> 위젯으로 문항 11·12번에 필요한 평균,
                    중앙값, 최댓값 등과 이상치를 확인하세요.
                  </>
                ),
                icon: '🔢',
              },
              {
                n: '3',
                t: '주제 구체화',
                d: (
                  <>
                    <strong>Visualize</strong> 범주의 <strong>Distributions</strong>(분포), <strong>Box Plot</strong>(집단
                    비교), <strong>Scatter Plot</strong>(두 변수 관계) 등으로 그래프를 그려봅니다.
                  </>
                ),
                icon: '📈',
              },
              {
                n: '4',
                t: '분석 목적 확정',
                d: '가장 유의미하고 재미있는 결과가 나오는 관계를 찾아 최종 분석 목적(문항 8번)으로 확정합니다.',
                icon: '🎯',
              },
            ].map((step) => (
              <div
                key={step.n}
                className="bg-white rounded-2xl p-6 shadow-sm border-t-4 border-teal-500 relative overflow-hidden"
              >
                <div className="text-5xl opacity-10 absolute -bottom-2 -right-2 select-none">{step.icon}</div>
                <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold mb-4">
                  {step.n}
                </div>
                <h3 className="font-bold text-lg mb-2 text-stone-800">{step.t}</h3>
                <p className="text-sm text-stone-600">{step.d}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-stone-600 mt-6 max-w-4xl">
            제출용 그래프를 남길 때는 시각화 위젯에서 <strong>차트 제목</strong>을 분석 주제에 맞게 적은 뒤{' '}
            <strong>차트 이미지보내기</strong>로 저장하세요.
          </p>
        </section>

        <section id="section-ai" className="scroll-mt-28">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-stone-900 flex items-center mb-4">
              <span className="text-4xl mr-3">🤖</span> STEP 3. AI 똑똑하게 활용하기
            </h2>
            <p className="text-stone-600 text-lg max-w-4xl">
              수업 중 AI는 정답을 내뱉는 자판기가 아니라, 여러분의 분석을 돕는 <strong>&apos;보조 튜터&apos;</strong>
              입니다. 올바른 질문법을 통해 수준 높은 힌트를 얻어보세요.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="bg-teal-50 px-6 py-4 border-b border-teal-100 flex items-center">
                <span className="text-2xl mr-2">⭕</span>
                <h3 className="font-bold text-teal-800 text-lg">추천하는 AI 질문법</h3>
              </div>
              <div className="p-6 space-y-4">
                {[
                  ['개념', '"범주형 변수와 수치형 변수의 차이가 뭐야? 중학생도 이해할 수 있게 예시를 들어서 설명해줘."'],
                  [
                    '기법',
                    '"내가 \'스마트폰 사용 시간\'과 \'성적\'의 관계를 보고 싶은데, 보기 중 어떤 분석 기법을 선택하는 게 맞아?"',
                  ],
                  [
                    '해석',
                    '"Orange 3 Scatter Plot에서 점들이 우측 상단으로 향하고 있어. 보고서에 어떻게 해석해서 쓰면 좋을까?"',
                  ],
                  ['검증', '"수면 시간이 길수록 성적이 높다고 나왔어. \'상관관계와 인과관계\' 측면에서 주의할 점이 뭘까?"'],
                ].map(([tag, text]) => (
                  <div key={tag} className="flex gap-4 items-start">
                    <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded shrink-0">{tag}</span>
                    <p className="text-sm text-stone-700">{text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
              <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center">
                <span className="text-2xl mr-2">❌</span>
                <h3 className="font-bold text-red-800 text-lg">절대 피해야 할 질문법</h3>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <p className="text-sm text-stone-700 italic">
                    &quot;내가 1번 데이터셋 골랐는데, 수행평가 1번부터 17번까지 정답 다 써줘.&quot;
                  </p>
                  <div className="mt-3 text-xs text-red-600 font-bold flex items-center">
                    <span className="mr-1">↳</span> 평가 당일 본인이 작성할 수 없게 됩니다.
                  </div>
                </div>
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200">
                  <p className="text-sm text-stone-700 italic">
                    &quot;Orange3 캡처 화면 줄 테니까 내 대신 수행평가 보고서 알아서 써줘.&quot;
                  </p>
                  <div className="mt-3 text-xs text-red-600 font-bold flex items-center">
                    <span className="mr-1">↳</span> 감점 및 0점 처리의 직접적인 원인이 됩니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-rules" className="scroll-mt-28">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-red-600 flex items-center mb-4">
              <span className="text-4xl mr-3">🚨</span> [매우 중요] 실전 유의사항
            </h2>
            <p className="text-stone-600 text-lg">
              수행평가 전 반드시 숙지해야 할 필수 규칙입니다. 위반 시 불이익이 발생할 수 있습니다.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border-l-4 border-red-500 rounded-r-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-3 text-stone-800 flex items-center">
                <span className="mr-2">🚫</span> 복사-붙여넣기 불가
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                실제 평가 시 외부 텍스트를 복사해 붙여넣을 수 없습니다. AI 문투를 그대로 베끼지 말고, 반드시{' '}
                <strong>&quot;내 머릿속에 이해된 나의 언어&quot;</strong>로 직접 타이핑하세요.
              </p>
            </div>
            <div className="bg-white border-l-4 border-amber-500 rounded-r-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-3 text-stone-800 flex items-center">
                <span className="mr-2">📈</span> 철저한 데이터 근거
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                본인의 단순 추측(뇌피셜)이나 AI가 지어낸 이야기를 쓰면 감점입니다.{' '}
                <strong>오직 Orange3에서 확인한 수치와 그래프 형태</strong>만을 근거로 해석을 작성하세요.
              </p>
            </div>
            <div className="bg-white border-l-4 border-blue-500 rounded-r-xl shadow-sm p-6">
              <h3 className="font-bold text-lg mb-3 text-stone-800 flex items-center">
                <span className="mr-2">📝</span> 사전 메모 필수
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                선택한 데이터셋 이름, 변수명, 파악해 둔 기초 통계 수치 등은{' '}
                <strong>평가 전 미리 메모하거나 숙지</strong>해야 당황하지 않고 문항을 채울 수 있습니다.
              </p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mb-12">
            <RiroschoolSubmitNotice grade={3} className="border-amber-300 bg-amber-50/95 border-2" />
          </div>

          <div className="bg-stone-800 rounded-2xl p-8 text-center text-white shadow-lg">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold mb-4">성공적인 수행평가를 위한 팁</h3>
            <p className="text-stone-300 max-w-2xl mx-auto mb-8">
              분석은 &apos;질문&apos;에서 시작합니다. 데이터 속에서 <strong>&quot;왜 그럴까?&quot;</strong>라는 진짜
              궁금증을 찾아낸다면, 분석과 보고서 작성은 아주 쉬워질 것입니다. 파이팅!
            </p>
            <Link
              to="/practice/3-bigdata"
              className="inline-flex items-center bg-teal-500 hover:bg-teal-400 text-white font-bold py-3 px-6 rounded-full transition-colors"
            >
              연습 사이트 바로가기 <span className="ml-2">→</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-stone-900 py-8 text-center text-stone-400 text-sm">
        <p>© 3학년 빅데이터 분석 수행평가 매뉴얼</p>
      </footer>
    </div>
  );
}
