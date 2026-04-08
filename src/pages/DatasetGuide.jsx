import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Download, ExternalLink, FileSpreadsheet, GraduationCap } from 'lucide-react';
import {
  DATASET_CATALOG,
  datasetFileUrl,
  datasetPhysicalFileName,
  datasetStatsForPurpose,
} from '../datasetCatalog.js';

/** **강조** 와 줄바꿈이 있는 수행평가용 출처 문단 렌더 */
function SourceAssessmentText({ text }) {
  return (
    <div className="text-xs text-slate-700 leading-relaxed space-y-1.5">
      {text.split('\n').map((line, i) => {
        const parts = line.split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
        return (
          <p key={i} className="m-0">
            {parts.map((part, j) => {
              const m = part.match(/^\*\*([^*]+)\*\*$/);
              if (m) return <strong key={j} className="text-slate-800">{m[1]}</strong>;
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}

/**
 * @param {{ variant?: 'assessment' | 'practice', fixedGrade?: 2 | 3 }} props
 * 수행평가용(assessment)은 fixedGrade와 함께 /datasets/assessment/grade2|3 에서만 사용합니다.
 */
export default function DatasetGuide({ variant = 'assessment', fixedGrade }) {
  const [internalGrade, setInternalGrade] = useState(2);
  const purpose = variant;
  const isAssessment = purpose === 'assessment';
  const grade = isAssessment ? fixedGrade : internalGrade;

  const submitPath = grade === 2 ? '/grade2' : '/grade3';
  const performHubPath = `/perform/grade${grade}`;
  const assessmentPathForGrade = `/datasets/assessment/grade${grade}`;
  const accentBtn =
    grade === 2
      ? 'bg-teal-700 hover:bg-teal-800 border-teal-900/20 text-white'
      : 'bg-orange-600 hover:bg-orange-700 border-orange-700/30 text-white';
  const tabActive2 = grade === 2 ? 'bg-teal-700 text-white shadow-md' : 'bg-white text-teal-800 border border-teal-200';
  const tabActive3 = grade === 3 ? 'bg-orange-600 text-white shadow-md' : 'bg-white text-orange-900 border border-orange-200';

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        {isAssessment ? (
          <Link
            to={performHubPath}
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
            {grade}학년 수행평가 안내
          </Link>
        ) : (
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft size={18} />
            처음으로
          </Link>
        )}
      </div>

      <div
        className={`rounded-2xl shadow-xl overflow-hidden border mb-8 ${
          grade === 2 ? 'border-teal-200 bg-white' : 'border-orange-200 bg-white'
        }`}
      >
        <div
          className={`px-6 py-8 text-white ${
            grade === 2 ? 'bg-gradient-to-br from-teal-700 to-teal-900' : 'bg-gradient-to-br from-orange-500 to-orange-700'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-sm font-medium opacity-90 mb-1 flex items-center gap-2">
                <GraduationCap size={18} className="opacity-90" />
                {grade}학년 · {isAssessment ? '수행평가 제출용 CSV' : '연습·실습용 CSV'}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                {isAssessment ? '수행평가용' : '연습용'} 데이터셋 안내 및 다운로드
              </h1>
              <p className="mt-3 text-sm sm:text-base opacity-95 max-w-2xl leading-relaxed">
                {isAssessment ? (
                  <>
                    아래 파일은 <strong>수행평가 제출</strong>에 사용하는 CSV입니다(결측이 정리된 버전).{' '}
                    <strong>데이터셋 번호는 1번부터 20번까지 연속</strong>이며, 파일명 앞 숫자(01~20)와 같습니다. 연습만 할 때는{' '}
                    <strong>선생님이 알려 주는 연습용 데이터셋 주소</strong>를 이용하세요.
                  </>
                ) : (
                  <>
                    아래 파일은 <strong>연습·Orange 실습·결측 학습</strong>용입니다. 일부 데이터에 <strong>결측치가 남아 있을 수</strong>
                    있습니다. <strong>본 수행평가 제출</strong>에는{' '}
                    <Link to={`/datasets/assessment/grade${grade}`} className="font-semibold underline underline-offset-2">
                      {grade}학년 수행평가용 데이터셋
                    </Link>
                    에서 받은 CSV를 사용하세요.
                  </>
                )}{' '}
                UTF-8(BOM)이므로 엑셀에서 한글이 깨지면 &apos;데이터 → 텍스트/CSV&apos;로 가져오기를 이용하세요.
              </p>
            </div>
            <BookOpen className="hidden sm:block opacity-30 flex-shrink-0" size={56} strokeWidth={1.25} />
          </div>
        </div>

        <div className="p-5 sm:p-6 border-b border-gray-100 bg-gray-50/80">
          {!isAssessment ? (
            <>
              <p className="text-sm font-semibold text-gray-700 mb-3">학년 선택</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setInternalGrade(2)}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm sm:text-base transition-all ${tabActive2}`}
                >
                  2학년 (정보)
                </button>
                <button
                  type="button"
                  onClick={() => setInternalGrade(3)}
                  className={`flex-1 py-3 px-4 rounded-xl font-semibold text-sm sm:text-base transition-all ${tabActive3}`}
                >
                  3학년 (빅데이터분석)
                </button>
              </div>
            </>
          ) : null}
          <p className={`text-xs sm:text-sm text-gray-600 leading-relaxed ${!isAssessment ? 'mt-4' : ''}`}>
            {grade === 2 ? (
              <>
                2학년용 파일은 그래프·추이·해석 중심 활동에 맞게 <strong>열 수와 행 수를 다소 줄인</strong> 버전입니다.
              </>
            ) : (
              <>
                3학년용 파일은 범주형·수치형 구분, 기초 통계, 그룹 비교 등에 맞게{' '}
                <strong>열을 더 포함</strong>하고 대용량 데이터는 <strong>행 상한을 넉넉히</strong> 두었습니다.
              </>
            )}
          </p>
        </div>

        {!isAssessment ? (
          <div className="p-4 sm:px-6 border-b border-gray-100 bg-white">
            <Link
              to="/datasets"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 underline underline-offset-2"
            >
              ← 데이터셋 안내 처음(수행평가용·연습용 선택)
            </Link>
          </div>
        ) : null}

        <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <FileSpreadsheet size={18} className="text-gray-500" />
            <span>
              총 <strong className="text-gray-900">{DATASET_CATALOG.length}</strong>개 (1~20번)
            </span>
          </div>
          {isAssessment ? (
            <Link
              to={submitPath}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-colors border sm:ml-auto ${accentBtn}`}
            >
              {grade}학년 제출 (새 탭)
              <ExternalLink size={16} className="opacity-90 shrink-0" aria-hidden />
            </Link>
          ) : (
            <div className="flex flex-col sm:flex-row gap-2 sm:ml-auto sm:items-center">
              <Link
                to={grade === 2 ? '/practice/2-information' : '/practice/3-bigdata'}
                className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition-colors border ${accentBtn}`}
              >
                {grade}학년 연습 페이지
              </Link>
              <Link
                to={assessmentPathForGrade}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-slate-300 bg-white text-slate-800 hover:bg-slate-50"
              >
                {grade}학년 수행평가용 CSV 안내
              </Link>
            </div>
          )}
        </div>
      </div>

      <ul className="space-y-4">
        {DATASET_CATALOG.map((d) => {
          const st = datasetStatsForPurpose(d, grade, purpose);
          const physical = datasetPhysicalFileName(d, purpose);
          const href = datasetFileUrl(grade, physical, purpose);
          return (
            <li
              key={`${purpose}-${grade}-${d.num}`}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-gray-900 leading-snug">
                      <span className="text-gray-500 font-semibold tabular-nums mr-2">{d.num}.</span>
                      {d.title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed">{d.blurb}</p>
                    {isAssessment && d.sourceAssessment ? (
                      <div className="mt-3 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5">
                        <p className="text-[11px] font-semibold text-slate-600 mb-2">데이터 출처 안내</p>
                        <SourceAssessmentText text={d.sourceAssessment} />
                      </div>
                    ) : !isAssessment && d.source ? (
                      <div className="mt-3 rounded-lg bg-slate-50 border border-slate-100 px-3 py-2.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 mb-1">
                          출처·원본·라이선스 안내
                        </p>
                        <p className="text-xs text-slate-700 leading-relaxed">{d.source}</p>
                      </div>
                    ) : null}
                    <p className="mt-3 text-xs text-gray-500 font-mono break-all">{physical}</p>
                    <p className="mt-2 text-xs text-gray-500">
                      약 <strong className="text-gray-700">{st.rows.toLocaleString()}</strong>행 ·{' '}
                      <strong className="text-gray-700">{st.cols}</strong>열 (
                      {isAssessment ? '수행평가용 파일 기준' : '연습용 파일 기준'})
                    </p>
                  </div>
                  <a
                    href={href}
                    download={physical}
                    className={`inline-flex items-center justify-center gap-2 shrink-0 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-md transition-colors ${
                      grade === 2 ? 'bg-teal-600 hover:bg-teal-700' : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                  >
                    <Download size={18} />
                    다운로드
                  </a>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <p className="mt-10 text-center text-xs text-gray-500 leading-relaxed px-2">
        {isAssessment
          ? '위 파일은 수업·수행평가용으로 제공됩니다. 세부 출처는 각 카드의 안내를 참고하세요.'
          : '데이터는 교육 목적으로 제공되며, 출처·라이선스는 각 원본 데이터셋을 따릅니다.'}
      </p>
    </div>
  );
}
