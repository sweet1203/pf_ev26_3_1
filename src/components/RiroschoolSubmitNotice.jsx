import React from 'react';

/**
 * 실제 수행평가 시 리로스쿨 등에 올리는 Orange·차트 파일 규칙 안내 (2·3학년 공통)
 */
export default function RiroschoolSubmitNotice({ className = '' }) {
  return (
    <aside
      className={`rounded-xl border-2 border-indigo-200 bg-indigo-50/95 p-4 sm:p-5 text-sm text-slate-800 leading-relaxed shadow-sm ${className}`}
      aria-labelledby="riroschool-submit-heading"
    >
      <h3 id="riroschool-submit-heading" className="font-bold text-indigo-950 text-base mb-3">
        리로스쿨 제출 파일 (총 2개)
      </h3>
      <p className="mb-3 text-slate-700">
        실제 수행평가에서는 <strong>리로스쿨</strong>(학교에서 안내하는 과제 제출 시스템)에 Orange 3 작업 파일과 차트 그림
        파일, <strong>총 2개</strong>를 올립니다. 연습용 Google 폼 제출과는 별도입니다.
      </p>
      <ol className="list-decimal pl-5 space-y-2.5 text-slate-800">
        <li>
          <strong className="text-indigo-900">Orange 전체 작업 (.ows)</strong> — Orange 메뉴 <strong>File → Save As…</strong>
          로 저장합니다. 파일 이름: <code className="text-xs bg-white/80 px-1.5 py-0.5 rounded border border-indigo-100">
            학번이름_수행1.ows
          </code>
          <span className="block mt-1 text-xs text-slate-600">
            예: 학번 30115, 이름 홍길동 → <code className="font-mono">30115홍길동_수행1.ows</code> (선생님의 안내에 따름)
          </span>
        </li>
        <li>
          <strong className="text-indigo-900">차트 이미지 (.png 또는 .jpg)</strong> — 시각화 위젯 창에서{' '}
          <strong>차트 제목</strong>을 본인의 <strong>분석 주제</strong>에 맞게 적어 둔 뒤,{' '}
          <strong>차트 이미지보내기</strong>(또는 Save image 등)로 저장합니다. 저장 파일 이름은{' '}
          <code className="text-xs bg-white/80 px-1.5 py-0.5 rounded border border-indigo-100">
            학번이름_차트제목.png
          </code>{' '}
          형태로 하고, <strong>차트제목</strong> 부분도 주제가 한눈에 드러나게 짓습니다.
          <span className="block mt-1 text-xs text-slate-600">
            예: <code className="font-mono">30115홍길동_연도별항공승객수추이.png</code>
          </span>
        </li>
      </ol>
      <p className="mt-3 text-xs text-slate-600">
        학번·이름 표기 순서·구분자(밑줄 등)는 <strong>선생님의 안내</strong>가 우선입니다.
      </p>
    </aside>
  );
}
