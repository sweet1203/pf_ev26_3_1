import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, ClipboardList, ExternalLink, FileDown, GraduationCap } from 'lucide-react';

/** @param {{ grade: 2 | 3 }} props */
export default function PerformAssessmentHub({ grade }) {
  const isG2 = grade === 2;
  const submitPath = isG2 ? '/grade2' : '/grade3';
  const datasetPath = `/datasets/assessment?grade=${grade}`;
  const manualPath = isG2 ? '/manual/grade2' : '/manual/grade3';
  const title = isG2 ? '2학년 정보' : '3학년 빅데이터분석';
  const border = isG2 ? 'border-teal-200' : 'border-orange-200';
  const hero = isG2 ? 'from-teal-700 to-teal-900' : 'from-orange-500 to-orange-700';
  const btnPrimary = isG2
    ? 'bg-teal-700 hover:bg-teal-800 border-teal-900/25'
    : 'bg-orange-600 hover:bg-orange-700 border-orange-700/35';
  const btnSubmit = isG2
    ? 'bg-white text-teal-900 border-2 border-teal-600 hover:bg-teal-50'
    : 'bg-white text-orange-950 border-2 border-orange-600 hover:bg-orange-50';

  return (
    <div className="max-w-lg mx-auto pb-12">
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={18} />
          처음으로
        </Link>
      </div>

      <div className={`rounded-2xl shadow-xl overflow-hidden border bg-white ${border}`}>
        <div className={`px-6 py-9 text-white bg-gradient-to-br ${hero}`}>
          <p className="text-sm font-medium opacity-90 mb-1 flex items-center gap-2">
            <GraduationCap size={18} className="opacity-90" />
            {grade}학년 · 수행평가 전용
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
            {title}
            <br />
            <span className="text-lg sm:text-xl font-semibold opacity-95">수행평가 안내</span>
          </h1>
          <p className="mt-4 text-sm opacity-95 leading-relaxed">
            이 주소만 북마크해 두면 <strong>데이터 받기</strong>와 <strong>제출</strong>만 순서대로 진행할 수 있습니다. 다른 학년 메뉴는 처음 화면에서만
            구분됩니다.
          </p>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">1단계</p>
          <Link
            to={datasetPath}
            className={`flex w-full items-center justify-center gap-3 py-4 px-5 rounded-xl text-base font-semibold text-white shadow-md transition-colors border ${btnPrimary}`}
          >
            <FileDown size={22} strokeWidth={2} aria-hidden />
            수행평가용 데이터셋 받기
          </Link>
          <p className="text-xs text-slate-600 leading-relaxed -mt-2 pl-1">
            같은 학년용 CSV(test01~test20)만 내려받습니다. 이 탭에서 다운로드한 뒤 Orange에서 분석하세요.
          </p>

          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide pt-2">2단계</p>
          <Link
            to={submitPath}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex w-full items-center justify-center gap-3 py-4 px-5 rounded-xl text-base font-semibold shadow-md transition-colors ${btnSubmit}`}
          >
            <ClipboardList size={22} strokeWidth={2} aria-hidden />
            수행평가 제출하기
            <ExternalLink size={18} className="opacity-80 shrink-0" aria-hidden />
          </Link>
          <p className="text-xs text-slate-600 leading-relaxed -mt-2 pl-1">
            <strong>새 탭</strong>에서 열립니다. 제출 화면에서는 <strong>복사·붙여넣기가 되지 않습니다</strong>. 내용을 미리 다른 메모장에 적어 두었다가
            직접 입력하세요.
          </p>
        </div>

        <div className="px-6 pb-6">
          <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-4">
            <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-2">
              <BookOpen size={14} aria-hidden />
              Orange·작성 방법이 헷갈릴 때
            </p>
            <Link
              to={manualPath}
              className={`text-sm font-semibold underline underline-offset-2 ${isG2 ? 'text-teal-800' : 'text-orange-800'}`}
            >
              {grade}학년 안내 매뉴얼 열기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
