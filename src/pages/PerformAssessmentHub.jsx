import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ClipboardList, ExternalLink, FileDown, GraduationCap } from 'lucide-react';

/** @param {{ grade: 2 | 3 }} props */
export default function PerformAssessmentHub({ grade }) {
  const isG2 = grade === 2;
  const submitPath = isG2 ? '/grade2' : '/grade3';
  const datasetPath = `/datasets/assessment/grade${grade}`;
  const manualPath = isG2 ? '/manual/grade2' : '/manual/grade3';
  const title = isG2 ? '2학년 정보' : '3학년 빅데이터분석';
  const border = isG2 ? 'border-teal-200' : 'border-orange-200';
  const hero = isG2 ? 'from-teal-700 to-teal-900' : 'from-orange-500 to-orange-700';
  const linkCard =
    'flex w-full items-center justify-center gap-3 py-4 px-5 rounded-xl text-base font-semibold shadow-md transition-colors border';
  const cardManual = isG2
    ? 'bg-white text-teal-900 border-2 border-teal-600 hover:bg-teal-50'
    : 'bg-white text-orange-950 border-2 border-orange-600 hover:bg-orange-50';
  const cardDataset = isG2
    ? 'bg-teal-700 hover:bg-teal-800 border-teal-900/25 text-white'
    : 'bg-orange-600 hover:bg-orange-700 border-orange-700/35 text-white';
  const cardSubmit = isG2
    ? 'bg-teal-900/90 hover:bg-teal-950 border-teal-950/40 text-white'
    : 'bg-orange-800 hover:bg-orange-900 border-orange-900/40 text-white';

  const newTab = { target: '_blank', rel: 'noopener noreferrer' };

  return (
    <div className="max-w-lg mx-auto pb-12">
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
            아래 세 가지는 모두 <strong>새 탭</strong>에서 열립니다. 매뉴얼·수행평가용 데이터셋·제출 페이지를 필요할 때마다
            골라 쓰면 됩니다. 이 주소만 북마크해 두세요.
          </p>
        </div>

        <div className="p-6 space-y-3">
          <Link to={manualPath} {...newTab} className={`${linkCard} ${cardManual}`}>
            <BookOpen size={22} strokeWidth={2} aria-hidden />
            {grade}학년 안내 매뉴얼
            <ExternalLink size={18} className="opacity-80 shrink-0" aria-hidden />
          </Link>

          <Link to={datasetPath} {...newTab} className={`${linkCard} ${cardDataset}`}>
            <FileDown size={22} strokeWidth={2} aria-hidden />
            {grade}학년 수행평가용 데이터셋
            <ExternalLink size={18} className="opacity-80 shrink-0" aria-hidden />
          </Link>

          <Link to={submitPath} {...newTab} className={`${linkCard} ${cardSubmit}`}>
            <ClipboardList size={22} strokeWidth={2} aria-hidden />
            {grade}학년 수행평가 제출
            <ExternalLink size={18} className="opacity-80 shrink-0" aria-hidden />
          </Link>

          <p className="text-xs text-slate-600 leading-relaxed pt-2 pl-0.5">
            제출 화면에서는 <strong>복사·붙여넣기·우클릭 메뉴가 제한</strong>됩니다.
          </p>
        </div>
      </div>
    </div>
  );
}
