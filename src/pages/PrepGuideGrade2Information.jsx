import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import {
  PREP_GUIDE_GRADE2_DATASETS,
  PREP_GUIDE_GRADE2_CATEGORIES,
  PREP_GUIDE_GRADE2_CATEGORY_COLORS,
} from '../data/prepGuideGrade2Datasets.js';
import { PRACTICE_FORM_GRADE2 } from '../practiceFormUrls.js';
import RiroschoolSubmitNotice from '../components/RiroschoolSubmitNotice.jsx';

ChartJS.register(ArcElement, Tooltip, Legend);

const SECTION_IDS = [
  { id: 'section-intro', label: '홈' },
  { id: 'section-datasets', label: '데이터 선정' },
  { id: 'section-step1', label: '수집 가이드' },
  { id: 'section-step2', label: '시각화 가이드' },
  { id: 'section-step3', label: '해석 가이드' },
];

export default function PrepGuideGrade2Information() {
  const [currentCategory, setCurrentCategory] = useState('전체');
  const [activeNav, setActiveNav] = useState('section-intro');

  const filteredDatasets = useMemo(() => {
    if (currentCategory === '전체') return PREP_GUIDE_GRADE2_DATASETS;
    return PREP_GUIDE_GRADE2_DATASETS.filter((d) => d.category === currentCategory);
  }, [currentCategory]);

  const chartData = useMemo(() => {
    const counts = {};
    PREP_GUIDE_GRADE2_DATASETS.forEach((d) => {
      counts[d.category] = (counts[d.category] || 0) + 1;
    });
    const labels = Object.keys(counts);
    return {
      labels,
      datasets: [
        {
          data: labels.map((l) => counts[l]),
          backgroundColor: labels.map((l) => PREP_GUIDE_GRADE2_CATEGORY_COLORS[l] || '#94a3b8'),
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 4,
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
    <div className="antialiased text-slate-900 bg-slate-50 selection:bg-blue-200 selection:text-blue-900 -mx-4 -mt-8 -mb-8 min-h-screen">
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 py-3 sm:h-16 sm:py-0">
            <div className="flex items-center">
              <span className="text-2xl mr-2" aria-hidden>
                💻
              </span>
              <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-800">[2학년 정보] 수행평가</span>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap gap-x-3 sm:gap-x-5 gap-y-1 overflow-x-auto pb-1 sm:pb-0">
              {SECTION_IDS.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setActiveNav(id);
                    scrollToSection(id);
                  }}
                  className={`px-1 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap border-b-[3px] ${
                    activeNav === id
                      ? 'border-blue-600 text-blue-700 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-20 pb-24">
        <section id="section-intro" className="scroll-mt-28 pt-4">
          <div className="bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 text-9xl opacity-5 select-none pointer-events-none" aria-hidden>
              📊
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight relative">
              데이터 수집부터 해석까지,
              <br />
              <span className="text-blue-600">수행평가 1 완벽 대비 가이드</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 max-w-3xl leading-relaxed relative">
              이 매뉴얼은 20개의 추천 데이터셋 중 나만의 데이터를 고르고,{' '}
              <strong>①데이터 수집, ②시각화, ③해석</strong>의 3단계를 완벽하게 작성할 수 있도록 돕는 인터랙티브 웹
              매뉴얼입니다.
            </p>
            <div className="flex flex-wrap gap-4 relative">
              <a
                href={PRACTICE_FORM_GRADE2}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-md hover:shadow-lg"
              >
                연습용 폼 접속하기 🚀
              </a>
              <div className="inline-flex items-center bg-amber-100 text-amber-800 px-4 py-3 rounded-xl font-medium text-sm border border-amber-200">
                <span className="text-lg mr-2">⚠️</span>
                복사-붙여넣기는 절대 금지! 본인만의 언어로 작성하세요.
              </div>
            </div>
            <p className="mt-6 text-sm text-slate-600 relative">
              CSV를 받아 연습하려면{' '}
              <Link to="/practice/2-information" className="text-blue-700 font-semibold underline hover:text-blue-900">
                2학년 연습 페이지
              </Link>
              로 이동하세요.
            </p>
          </div>
        </section>

        <section id="section-datasets" className="scroll-mt-28">
          <div className="mb-8">
            <div className="inline-block bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm mb-3">STEP 0</div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center mb-4">나만의 데이터 선정하기 🗂️</h2>
            <p className="text-slate-600 text-lg max-w-4xl">
              관심 있는 분야의 데이터를 선택해야 시각화와 해석이 쉬워집니다. 제공된 20개의 데이터셋 중 하나를 골라보세요.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
              <h3 className="text-lg font-bold text-slate-800 mb-2 text-center">주제별 데이터 분포</h3>
              <p className="text-sm text-slate-500 text-center mb-6">어떤 주제의 데이터가 가장 많을까요?</p>
              <div className="relative w-full max-w-[450px] mx-auto flex-grow min-h-[280px] md:min-h-[320px]">
                <Doughnut
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { boxWidth: 12, padding: 15, font: { size: 12 } },
                      },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => ` ${ctx.label}: ${ctx.raw}개 데이터셋`,
                        },
                      },
                    },
                    cutout: '60%',
                  }}
                />
              </div>
            </div>

            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                  <h3 className="text-xl font-bold text-slate-800">데이터셋 탐색기</h3>
                  <div className="flex flex-wrap gap-2">
                    {PREP_GUIDE_GRADE2_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setCurrentCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          currentCategory === cat
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-2 flex-grow max-h-[600px]">
                  {filteredDatasets.length === 0 ? (
                    <div className="col-span-2 text-center py-10 text-slate-400">해당 카테고리의 데이터가 없습니다.</div>
                  ) : (
                    filteredDatasets.map((data) => (
                      <div
                        key={data.id}
                        className="bg-white p-5 rounded-xl border border-slate-200 flex flex-col h-full transition-all duration-200 ease-in-out hover:-translate-y-1 hover:shadow-lg hover:border-blue-500"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="bg-slate-100 text-slate-500 text-xs px-2 py-1 rounded font-bold">
                            No. {data.id}
                          </span>
                          <span
                            className="text-[10px] font-bold px-2 py-1 rounded-full text-white"
                            style={{ backgroundColor: PREP_GUIDE_GRADE2_CATEGORY_COLORS[data.category] || '#94a3b8' }}
                          >
                            {data.category}
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-[1.1rem] mb-2 leading-tight">{data.title}</h4>
                        <p className="text-sm text-slate-600 mb-4 flex-grow">{data.desc}</p>
                        <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500 font-medium">
                          <span className="flex items-center">
                            <span className="mr-1">📄</span> {data.rows}
                          </span>
                          <span className="flex items-center">
                            <span className="mr-1">🏷️</span> {data.cols}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="section-step1" className="scroll-mt-28">
          <div className="mb-8">
            <div className="inline-block bg-indigo-100 text-indigo-800 font-bold px-3 py-1 rounded-full text-sm mb-3">STEP 1</div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center mb-4">데이터 수집 (문항 4~6) 📥</h2>
            <p className="text-slate-600 text-lg">
              데이터의 출처와 내용을 정확히 파악하여 신뢰성을 확보하는 단계입니다.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: '🌐',
                t: '문항 4. 출처 작성',
                p: '데이터를 어디서 가져왔는지 명확히 밝혀야 합니다.',
                ex: '예시:',
                box: 'Kaggle 공개 데이터, 통계청, 기상청, 수업 제공 데이터(05_세계행복.csv) 등',
              },
              {
                icon: '📝',
                t: '문항 5. 내용 설명',
                p: '이 데이터가 무엇을 다루고 있는지 2~3문장으로 요약하세요.',
                ex: '예시:',
                box: '이 데이터는 2019년 세계 각국의 행복 점수와 GDP, 건강 등의 지표를 담은 자료입니다. 국가의 경제력과 행복의 관계를 알아볼 수 있습니다.',
              },
              {
                icon: '📋',
                t: '문항 6. 항목(열) 작성',
                p: '엑셀 파일의 맨 윗줄에 있는 핵심 열 이름(변수)들을 나열하세요.',
                ex: '예시:',
                box: '연도, 지역, 미세먼지 농도 / 나이, 객실 등급, 생존 여부 등',
              },
            ].map((c) => (
              <div key={c.t} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm border-t-4 border-t-indigo-500">
                <div className="text-3xl mb-4">{c.icon}</div>
                <h3 className="font-bold text-lg mb-2">{c.t}</h3>
                <p className="text-sm text-slate-600 mb-4">{c.p}</p>
                <div className="bg-slate-50 p-3 rounded-lg text-sm border border-slate-100">
                  <span className="text-indigo-600 font-bold">{c.ex}</span> {c.box}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="section-step2" className="scroll-mt-28">
          <div className="mb-8">
            <div className="inline-block bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full text-sm mb-3">STEP 2</div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center mb-4">데이터 시각화 (문항 7~8) 📈</h2>
            <p className="text-slate-600 text-lg">
              수집한 데이터를 가장 효과적으로 보여줄 수 있는 그래프를 선택하고 이유를 논리적으로 설명합니다.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="grid md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              {[
                {
                  icon: '📊',
                  t: '막대 그래프',
                  p: (
                    <>
                      여러 집단이나 항목 간의 크기(수량)를 <strong>비교</strong>할 때 사용합니다.
                    </>
                  ),
                  ex: '예: 지역별 대기질 비교, 성별에 따른 팁 금액 차이',
                },
                {
                  icon: '📉',
                  t: '꺾은선 그래프',
                  p: (
                    <>
                      시간의 흐름에 따른 데이터의 <strong>변화 추이</strong>를 파악할 때 적합합니다.
                    </>
                  ),
                  ex: '예: 연도별 항공 승객 수 추이, 날짜별 우버 운행 건수',
                },
                {
                  icon: '🍩',
                  t: '원 그래프',
                  p: (
                    <>
                      전체에서 각 항목이 차지하는 <strong>비율(비중)</strong>을 나타낼 때 효과적입니다.
                    </>
                  ),
                  ex: '예: 전체 영화 중 장르별 비율, 타이타닉 객실 등급별 비율',
                },
                {
                  icon: '🎛️',
                  t: '산점도 (분산형)',
                  p: (
                    <>
                      두 수치형 데이터 간의 <strong>상관관계(연관성)</strong>를 파악할 때 사용합니다.
                    </>
                  ),
                  ex: '예: 키와 몸무게의 관계, 수면 시간과 스트레스의 관계',
                },
              ].map((g) => (
                <div key={g.t} className="p-6 hover:bg-slate-50 transition-colors">
                  <div className="text-4xl text-emerald-500 mb-4">{g.icon}</div>
                  <h3 className="font-bold text-lg text-slate-800 mb-2">{g.t}</h3>
                  <p className="text-sm text-slate-600 mb-4">{g.p}</p>
                  <p className="text-xs text-slate-500 bg-slate-100 p-2 rounded">{g.ex}</p>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 p-6 border-t border-slate-200">
              <h4 className="font-bold text-emerald-800 mb-2">💡 문항 8 작성 팁 (선택 이유)</h4>
              <p className="text-sm text-slate-700">
                단순히 &quot;보기 편해서&quot;라고 적으면 안 됩니다. <br />
                <strong>
                  &quot;연도별 항공 승객 수의 &apos;시간에 따른 변화 추이&apos;를 한눈에 파악하기 위해 꺾은선그래프를
                  선택했습니다.&quot;
                </strong>{' '}
                처럼 데이터의 특성과 그래프의 목적을 연결하세요.
              </p>
              <p className="text-sm text-slate-700 mt-4 pt-4 border-t border-slate-200">
                <strong>실제 제출:</strong> Orange에서 그래프 창의 <strong>차트 제목</strong>을 이 주제에 맞게 적어 둔 뒤{' '}
                <strong>차트 이미지보내기</strong>로 저장합니다. 리로스쿨에는 이 PNG와 <strong>학번이름_수행1.ows</strong> 등
                규칙은 아래 박스를 참고하세요.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto">
          <RiroschoolSubmitNotice className="border-blue-300 bg-blue-50/90" />
        </div>

        <section id="section-step3" className="scroll-mt-28">
          <div className="mb-8">
            <div className="inline-block bg-rose-100 text-rose-800 font-bold px-3 py-1 rounded-full text-sm mb-3">STEP 3</div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center mb-4">데이터 해석 (문항 9) 🔍</h2>
            <p className="text-slate-600 text-lg">
              가장 중요한 배점 구간입니다. 그래프를 바탕으로 <strong>5문장 이상</strong>의 완성된 글로 통찰력을 보여주세요.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-6 md:p-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">
              완벽한 해석을 위한 4가지 필수 요소
            </h3>
            <div className="space-y-6">
              {[
                {
                  n: '1',
                  h: '변화 추이 및 특징 (팩트)',
                  p: '그래프의 전체적인 모양이 어떤지 설명합니다. (예: 지속적으로 상승하고 있다, 두 그룹 간 뚜렷한 차이가 있다)',
                },
                {
                  n: '2',
                  h: '구체적인 수치 근거',
                  p: '「많아졌다」「조금 늘었다」처럼 막연하게 쓰지 말고, 그래프·표에서 읽은 숫자를 넣으세요. 예: 「A 항목 평균이 B 항목보다 약 2배 높다」, 「가장 큰 값은 150이다」처럼 비교·최댓값·단위가 드러나게 쓰면 좋습니다.',
                },
                {
                  n: '3',
                  h: '미래 예측',
                  p: '현재의 데이터 패턴을 바탕으로 앞으로 어떻게 될지 합리적으로 예측해보세요.',
                },
                {
                  n: '4',
                  h: '사회적 의미',
                  p: '이 결과가 우리 사회, 학교, 혹은 일상생활에 어떤 시사점을 주는지 결론을 맺습니다.',
                },
              ].map((item) => (
                <div key={item.n} className="flex items-start">
                  <div className="flex-shrink-0 bg-rose-100 text-rose-600 w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 mt-1">
                    {item.n}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800">{item.h}</h4>
                    <p className="text-slate-600 text-sm mt-1">{item.p}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 bg-slate-50 p-5 rounded-xl border border-slate-200 relative">
              <div className="absolute -top-3 left-5 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded">
                작성 예시 (합치면 5문장 이상)
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed pt-2">
                &quot;[추이/특징] 그래프를 살보면 수면 시간이 길어질수록 스트레스 지수가 낮아지는 뚜렷한 반비례 관계를
                확인할 수 있습니다. [수치 근거] 특히 수면 시간이 5시간 미만인 집단의 평균 스트레스 지수는 80점대인 반면, 7시간
                이상인 집단은 40점대로 약 2배 가까운 차이를 보였습니다. [추이/특징] 또한 직업군에 따라서도 수면 질의 편차가
                크게 나타났습니다. [미래 예측] 현대인들의 스마트폰 사용 증가로 수면 부족 현상이 지속된다면, 향후 만성 스트레스
                환자 비율은 더욱 급증할 것으로 예상됩니다. [사회적 의미] 따라서 개인의 건강과 업무 효율성을 높이기 위해 우리
                사회 차원에서 적정 수면 시간을 보장하는 캠페인이나 제도적 개선이 필요함을 시사합니다.&quot;
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 py-12 text-center text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-white mb-6">준비가 끝났다면, 이제 실전입니다!</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              to="/practice/2-information"
              className="inline-flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-8 rounded-full transition-all shadow-lg"
            >
              2학년 연습 페이지 (CSV) →
            </Link>
            <a
              href={PRACTICE_FORM_GRADE2}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-full transition-all hover:scale-105 shadow-lg"
            >
              수행평가 연습 폼으로 이동하기 📝
            </a>
          </div>
          <p className="text-sm">© 2학년 정보 교과 수행평가 매뉴얼. Data sources are for educational purposes.</p>
        </div>
      </footer>
    </div>
  );
}
