import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ClipboardCheck, Database, GraduationCap, Sparkles } from 'lucide-react';

export default function DatasetHub() {
  return (
    <div className="max-w-4xl mx-auto pb-16">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={18} />
          처음으로
        </Link>
      </div>

      <div className="rounded-2xl shadow-xl overflow-hidden border border-slate-200 bg-white mb-8">
        <div className="px-6 py-8 text-white bg-gradient-to-br from-slate-700 to-slate-900">
          <p className="text-sm font-medium opacity-90 mb-1 flex items-center gap-2">
            <GraduationCap size={18} className="opacity-90" />
            2학년 · 3학년 공통
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">데이터셋 안내</h1>
          <p className="mt-3 text-sm sm:text-base opacity-95 max-w-2xl leading-relaxed">
            용도에 따라 페이지를 나누었습니다. <strong>수행평가 제출</strong>에는 반드시 <strong>본인 학년</strong>의 수행평가용
            CSV를 사용하고, <strong>연습·Orange 실습·결측 처리 학습</strong>에는 연습용 CSV를 사용하세요. 수행평가용은 학년별
            페이지가 완전히 분리되어 있습니다.
          </p>
        </div>
      </div>

      <p className="text-sm font-semibold text-slate-800 mb-3">수행평가용 (학년별)</p>
      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <Link
          to="/datasets/assessment/grade2"
          className="group block rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-6 shadow-sm hover:shadow-md hover:border-teal-400 transition-all"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-teal-700 text-white p-3 shrink-0 group-hover:bg-teal-800 transition-colors">
              <ClipboardCheck size={26} strokeWidth={1.75} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-teal-950">2학년 수행평가용 데이터셋</h2>
              <p className="mt-1.5 text-sm text-slate-700 leading-relaxed">
                정보 과정 제출용 CSV(결측 정리). 3학년 페이지와 서로 바꿀 수 없습니다.
              </p>
              <p className="mt-3 text-sm font-semibold text-teal-800 group-hover:underline">열기 →</p>
            </div>
          </div>
        </Link>
        <Link
          to="/datasets/assessment/grade3"
          className="group block rounded-2xl border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-white p-6 shadow-sm hover:shadow-md hover:border-orange-400 transition-all"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-orange-600 text-white p-3 shrink-0 group-hover:bg-orange-700 transition-colors">
              <ClipboardCheck size={26} strokeWidth={1.75} aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-orange-950">3학년 수행평가용 데이터셋</h2>
              <p className="mt-1.5 text-sm text-slate-700 leading-relaxed">
                빅데이터분석 제출용 CSV(결측 정리). 2학년 페이지와 서로 바꿀 수 없습니다.
              </p>
              <p className="mt-3 text-sm font-semibold text-orange-900 group-hover:underline">열기 →</p>
            </div>
          </div>
        </Link>
      </div>

      <Link
        to="/datasets/practice"
        className="group block rounded-2xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-6 sm:p-8 shadow-sm hover:shadow-md hover:border-amber-400 transition-all"
      >
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-amber-600 text-white p-3 shrink-0 group-hover:bg-amber-700 transition-colors">
            <Sparkles size={28} strokeWidth={1.75} aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-amber-950 flex items-center gap-2 flex-wrap">
              연습용 데이터셋
              <span className="text-sm font-semibold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md">
                연습·실습 전용
              </span>
            </h2>
            <p className="mt-2 text-sm text-slate-700 leading-relaxed">
              원본에 가까운 정리본으로, 일부 데이터에는 <strong>결측치가 남아 있을 수 있습니다</strong>. 연습 페이지·대비
              가이드·결측 처리 학습에 활용하세요. 공식 제출에는 사용하지 마세요. 페이지 안에서 2·3학년을 선택할 수 있습니다.
            </p>
            <p className="mt-4 text-sm font-semibold text-amber-900 group-hover:underline">페이지 열기 →</p>
          </div>
        </div>
      </Link>

      <p className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-500 text-center px-2">
        <Database size={14} className="shrink-0 opacity-70" aria-hidden />
        파일은 UTF-8(BOM) CSV입니다. 엑셀에서 한글이 깨지면 &apos;데이터 → 텍스트/CSV&apos;로 가져오기를 이용하세요.
      </p>
    </div>
  );
}
