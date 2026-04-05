import React, { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { TextAreaField } from '../components/TextAreaField.jsx';
import { getClientSubmissionMeta } from '../clientDeviceMeta.js';
import { createTextGuards } from '../formGuards.js';
import { postToGoogleSheet } from '../sheetSubmit.js';
import { CLASS_OPTIONS_GRADE2, GOOGLE_SHEET_TAB_GRADE2 } from '../constants.js';
import { validateSubmissionIdentity } from '../validateStudentId.js';

function buildTextDataPayload(state) {
  const {
    dataSource,
    dataDescription,
    dataColumns,
    graphType,
    graphSelectionReason,
    dataInterpretation,
  } = state;
  return {
    dataSource,
    dataDescription,
    dataColumns,
    graphType,
    graphSelectionReason,
    dataInterpretation,
  };
}

export default function Grade2Submit() {
  const { showToast } = useOutletContext();
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');

  const [dataSource, setDataSource] = useState('');
  const [dataDescription, setDataDescription] = useState('');
  const [dataColumns, setDataColumns] = useState('');
  const [graphType, setGraphType] = useState('');
  const [graphSelectionReason, setGraphSelectionReason] = useState('');
  const [dataInterpretation, setDataInterpretation] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { onPaste: handleTextPaste, onDrop: handleTextDrop, onBeforeInput: handleBeforeInput } = useMemo(
    () => createTextGuards(showToast),
    [showToast],
  );

  const resetForm = () => {
    setStudentId('');
    setStudentName('');
    setStudentClass('');
    setDataSource('');
    setDataDescription('');
    setDataColumns('');
    setGraphType('');
    setGraphSelectionReason('');
    setDataInterpretation('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const identity = validateSubmissionIdentity(studentId, studentName, studentClass);
    if (!identity.ok) {
      showToast(identity.message, 'error');
      return;
    }

    const textData = buildTextDataPayload({
      dataSource,
      dataDescription,
      dataColumns,
      graphType,
      graphSelectionReason,
      dataInterpretation,
    });

    setIsSubmitting(true);
    try {
      const ts = Date.now();
      const sheetPayload = {
        gradeLevel: 2,
        subject: '정보',
        sheetName: GOOGLE_SHEET_TAB_GRADE2,
        studentId: identity.id,
        studentName: identity.name,
        studentClass: identity.studentClass,
        timestamp: new Date(ts).toLocaleString('ko-KR'),
        ...getClientSubmissionMeta(),
        textData,
      };
      const result = await postToGoogleSheet(sheetPayload);
      if (!result.ok) {
        showToast(result.message, 'error');
        return;
      }
      showToast('🎉 제출되었습니다.', 'success');
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all';

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-teal-600 p-6 text-white text-center relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-sm font-medium text-teal-100 mb-1">2학년 · 정보</p>
          <h1 className="text-3xl font-bold mb-2">수행평가 제출</h1>
        </div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500 rounded-full opacity-50" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-teal-700 rounded-full opacity-50" />
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">✔ 기본 정보</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                학번을 작성하세요. <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={5}
                placeholder="숫자 5자리 (예: 20101)"
                className={inputClass}
                value={studentId}
                onChange={(e) => setStudentId(e.target.value.replace(/\D/g, '').slice(0, 5))}
                onPaste={handleTextPaste}
                onDrop={handleTextDrop}
                onBeforeInput={handleBeforeInput}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                이름을 작성하세요. <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="홍길동"
                className={inputClass}
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                onPaste={handleTextPaste}
                onDrop={handleTextDrop}
                onBeforeInput={handleBeforeInput}
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              반을 작성하세요. <span className="text-red-500">*</span>
              <span className="font-normal text-gray-500 ml-1">(정보 A, C, D, E 중 하나)</span>
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CLASS_OPTIONS_GRADE2.map((opt) => (
                <label
                  key={opt}
                  className={`flex cursor-pointer items-center justify-center rounded-lg border px-3 py-3 text-center text-sm font-medium transition-colors ${
                    studentClass === opt ? 'border-teal-500 bg-teal-50 text-teal-900' : 'border-gray-200 bg-white text-gray-800 hover:border-teal-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="studentClassG2"
                    value={opt}
                    checked={studentClass === opt}
                    onChange={() => setStudentClass(opt)}
                    className="sr-only"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">① 데이터 수집</h2>
          <TextAreaField
            label="데이터의 출처를 작성하세요."
            hint="👉 (예: 공공데이터포털, 통계청 등)"
            value={dataSource}
            onChange={(e) => setDataSource(e.target.value)}
            rows={3}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
          <TextAreaField
            label="어떤 데이터를 수집했는지 2~3문장으로 설명하세요."
            hint="👉 (무엇에 대한 데이터인지)"
            value={dataDescription}
            onChange={(e) => setDataDescription(e.target.value)}
            rows={4}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
          <TextAreaField
            label="수집한 데이터의 항목(열)을 작성하세요."
            hint="👉 (예: 연도, 기온, 지역 등)"
            value={dataColumns}
            onChange={(e) => setDataColumns(e.target.value)}
            rows={3}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
        </div>

        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">② 데이터 시각화</h2>
          <TextAreaField
            label="사용한 그래프의 종류를 작성하세요."
            hint="👉 (예: 막대그래프, 꺾은선그래프 등)"
            value={graphType}
            onChange={(e) => setGraphType(e.target.value)}
            rows={2}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
          <TextAreaField
            label="해당 그래프를 선택한 이유를 작성하세요."
            hint="👉 (데이터의 특성과 연결하여 설명)"
            value={graphSelectionReason}
            onChange={(e) => setGraphSelectionReason(e.target.value)}
            rows={4}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
        </div>

        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">③ 데이터 해석 (핵심)</h2>
          <TextAreaField
            label="그래프를 바탕으로 데이터의 변화 추이, 특징, 미래 예측, 사회적 의미를 포함하여 5문장 이상의 완성된 글로 작성하세요."
            value={dataInterpretation}
            onChange={(e) => setDataInterpretation(e.target.value)}
            rows={10}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
        </div>

        <div className="mt-8 rounded-xl border border-orange-200 bg-orange-50 px-5 py-4 text-center text-gray-800">
          <p className="text-base font-semibold">파일은 리로스쿨에 제출하세요.</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 text-white text-lg font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] ${
            isSubmitting ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
          }`}
        >
          {isSubmitting ? '전송 중...' : '최종 제출하기'}
        </button>
      </form>
    </div>
  );
}
