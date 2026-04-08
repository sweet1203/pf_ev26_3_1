import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookMarked } from 'lucide-react';

/**
 * 학년별 매뉴얼 공통 레이아웃 (teal / orange 테마)
 */
export function ManualChrome({ grade, title, subtitle, children }) {
  const isG2 = grade === 2;
  const heroGrad = isG2 ? 'bg-gradient-to-br from-teal-700 to-teal-900' : 'bg-gradient-to-br from-orange-500 to-orange-700';
  const outerBorder = isG2 ? 'border-teal-200' : 'border-orange-200';
  const cardBorder = isG2 ? 'border-teal-100' : 'border-orange-100';
  const linkAccent = isG2 ? 'text-teal-800 hover:text-teal-950' : 'text-orange-800 hover:text-orange-950';
  const submitPath = isG2 ? '/grade2' : '/grade3';

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={18} />
          처음으로
        </Link>
      </div>

      <header
        className={`rounded-2xl border-2 shadow-lg overflow-hidden mb-8 ${outerBorder}`}
      >
        <div className={`px-6 py-8 text-white ${heroGrad}`}>
          <div className="flex items-start gap-3">
            <BookMarked className="shrink-0 opacity-90 mt-0.5" size={28} />
            <div>
              <p className="text-sm font-medium opacity-90 mb-1">{grade}학년 · 수행평가 진행 안내</p>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{title}</h1>
              {subtitle ? <p className="mt-3 text-sm sm:text-base opacity-95 leading-relaxed max-w-2xl">{subtitle}</p> : null}
            </div>
          </div>
        </div>
        <div className={`bg-white px-6 py-4 text-sm border-t ${cardBorder} flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4`}>
          <Link to="/datasets/assessment" className={`font-semibold underline underline-offset-2 ${linkAccent}`}>
            수행평가용 데이터셋 · CSV 다운로드
          </Link>
          <span className="hidden sm:inline text-gray-300">|</span>
          <Link to={submitPath} className={`font-semibold underline underline-offset-2 ${linkAccent}`}>
            {grade}학년 제출 페이지
          </Link>
        </div>
      </header>

      <div className="space-y-8 text-gray-800">{children}</div>
    </div>
  );
}

export function ManualH2({ children }) {
  return <h2 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">{children}</h2>;
}

export function ManualStep({ n, title, children }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 sm:p-6 shadow-sm">
      <div className="flex gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white"
          aria-hidden
        >
          {n}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold text-gray-900 leading-snug">{title}</h3>
          <div className="mt-3 text-sm text-gray-700 leading-relaxed space-y-3">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function ManualTip({ children }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 leading-relaxed">
      <strong className="font-semibold">팁 · </strong>
      {children}
    </div>
  );
}

export function ManualUl({ items }) {
  return (
    <ul className="list-disc pl-5 space-y-1.5 text-sm">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}
