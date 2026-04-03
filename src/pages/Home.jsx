import React from 'react';
import { Link } from 'react-router-dom';

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
      </div>
    </div>
  );
}
