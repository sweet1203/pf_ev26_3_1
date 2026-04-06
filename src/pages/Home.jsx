import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, BookOpen, Database } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
      <div className="bg-slate-800 p-8 text-white text-center border-b border-slate-700">
        <h1 className="text-xl sm:text-2xl font-bold mb-3 leading-snug text-white">
          2026학년도 1학기
          <br />
          수행평가 1차 제출 페이지
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          아래에서 해당 학년을 선택하신 뒤, 안내에 따라 제출해 주시기 바랍니다.
        </p>
      </div>
      <div className="p-8 space-y-4">
        <Link
          to="/grade3"
          className="block w-full py-4 px-6 text-center text-lg font-semibold rounded-xl bg-orange-600 text-white shadow-md hover:bg-orange-700 transition-colors active:scale-[0.98] border border-orange-700/30"
        >
          3학년 제출
          <span className="block text-sm font-normal text-orange-100 mt-1 opacity-95">빅데이터분석</span>
        </Link>
        <Link
          to="/grade2"
          className="block w-full py-4 px-6 text-center text-lg font-semibold rounded-xl bg-teal-700 text-white shadow-md hover:bg-teal-800 transition-colors active:scale-[0.98] border border-teal-900/20"
        >
          2학년 제출
          <span className="block text-sm font-normal text-teal-100 mt-1 opacity-95">정보</span>
        </Link>
        <Link
          to="/datasets"
          className="flex w-full items-center justify-center gap-2 py-3.5 px-6 text-center text-sm font-semibold rounded-xl border-2 border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100 hover:border-slate-400 transition-colors"
        >
          <Database size={18} className="text-slate-600" aria-hidden />
          데이터셋 안내 · 다운로드
        </Link>
        <div className="pt-2 border-t border-slate-200 space-y-2">
          <p className="text-xs font-semibold text-slate-500 text-center">수행평가 진행 안내 (Orange 3)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Link
              to="/manual/grade2"
              className="flex items-center justify-center gap-2 py-3 px-4 text-center text-sm font-semibold rounded-xl border border-teal-200 bg-teal-50 text-teal-900 hover:bg-teal-100 transition-colors"
            >
              <BookOpen size={16} aria-hidden />
              2학년 안내 매뉴얼
            </Link>
            <Link
              to="/manual/grade3"
              className="flex items-center justify-center gap-2 py-3 px-4 text-center text-sm font-semibold rounded-xl border border-orange-200 bg-orange-50 text-orange-900 hover:bg-orange-100 transition-colors"
            >
              <BookOpen size={16} aria-hidden />
              3학년 안내 매뉴얼
            </Link>
          </div>
          <Link
            to="/practice/2-information/prep"
            className="flex w-full items-center justify-center gap-2 py-3 px-4 text-center text-sm font-semibold rounded-xl border border-teal-300 bg-teal-50 text-teal-950 hover:bg-teal-100 transition-colors"
          >
            <BarChart3 size={16} className="text-teal-800 shrink-0" aria-hidden />
            2학년 연습 전 대비 가이드 (데이터·수집·시각화·해석)
          </Link>
          <Link
            to="/practice/3-bigdata/prep"
            className="flex w-full items-center justify-center gap-2 py-3 px-4 text-center text-sm font-semibold rounded-xl border border-amber-300 bg-amber-50 text-amber-950 hover:bg-amber-100 transition-colors"
          >
            <BarChart3 size={16} className="text-amber-800 shrink-0" aria-hidden />
            3학년 연습 전 대비 가이드 (데이터·Orange3·AI)
          </Link>
        </div>
      </div>
    </div>
  );
}
