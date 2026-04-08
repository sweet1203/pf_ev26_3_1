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
    dataName,
    dataSource,
    dataDescription,
    dataColumns,
    graphType,
    graphSelectionReason,
    dataInterpretation,
  } = state;
  return {
    dataName,
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

  const [dataName, setDataName] = useState('');
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
    setDataName('');
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

    if (!dataName.trim()) {
      showToast('?곗씠???대쫫???묒꽦?섏꽭??', 'error');
      return;
    }

    const textData = buildTextDataPayload({
      dataName: dataName.trim(),
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
        subject: '?뺣낫',
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
      showToast('?럦 ?쒖텧?섏뿀?듬땲??', 'success');
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none transition-all';

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="-mx-4 -my-8 min-h-screen px-4 py-8"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-teal-600 p-6 text-white text-center relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-sm font-medium text-teal-100 mb-1">2?숇뀈 쨌 ?뺣낫</p>
          <h1 className="text-3xl font-bold mb-2">?섑뻾?됯? ?쒖텧</h1>
        </div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500 rounded-full opacity-50" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-teal-700 rounded-full opacity-50" />
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">??湲곕낯 ?뺣낫</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                ?숇쾲???묒꽦?섏꽭?? <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                maxLength={5}
                placeholder="?レ옄 5?먮━ (?? 20101)"
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
                ?대쫫???묒꽦?섏꽭?? <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="?띻만??
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
              諛섏쓣 ?묒꽦?섏꽭?? <span className="text-red-500">*</span>
              <span className="font-normal text-gray-500 ml-1">(?뺣낫 A, C, D, E 以??섎굹)</span>
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">???곗씠???섏쭛</h2>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              ?섑뻾?됯????곗씠?곗뀑???대쫫(?곗씠???대쫫)???묒꽦?섏꽭?? <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-gray-500 mb-2 leading-relaxed">
              ?몛 ?섑뻾?됯????곗씠?곗뀑 ?덈궡???섏삩 <strong>?뚯씪紐?/strong>怨?媛숆쾶 ?곸쑝?몄슂.
            </p>
            <input
              type="text"
              autoComplete="off"
              placeholder="?? test01_?숈깮?쒗뿕?먯닔.csv"
              className={inputClass}
              value={dataName}
              onChange={(e) => setDataName(e.target.value)}
              onPaste={handleTextPaste}
              onDrop={handleTextDrop}
              onBeforeInput={handleBeforeInput}
            />
          </div>
          <TextAreaField
            label="?곗씠?곗쓽 異쒖쿂瑜??묒꽦?섏꽭??"
            hint="?몛 (?? 怨듦났?곗씠?고룷?? ?듦퀎泥???"
            value={dataSource}
            onChange={(e) => setDataSource(e.target.value)}
            rows={3}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
          <TextAreaField
            label="?대뼡 ?곗씠?곕? ?섏쭛?덈뒗吏 2~3臾몄옣?쇰줈 ?ㅻ챸?섏꽭??"
            hint="?몛 (臾댁뾿??????곗씠?곗씤吏)"
            value={dataDescription}
            onChange={(e) => setDataDescription(e.target.value)}
            rows={4}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
          <TextAreaField
            label="?섏쭛???곗씠?곗쓽 ??ぉ(?????묒꽦?섏꽭??"
            hint="?몛 (?? ?곕룄, 湲곗삩, 吏????"
            value={dataColumns}
            onChange={(e) => setDataColumns(e.target.value)}
            rows={3}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
        </div>

        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">???곗씠???쒓컖??/h2>
          <TextAreaField
            label="?ъ슜??洹몃옒?꾩쓽 醫낅쪟瑜??묒꽦?섏꽭??"
            hint="?몛 (?? 留됰?洹몃옒?? 爰얠??좉렇?섑봽 ??"
            value={graphType}
            onChange={(e) => setGraphType(e.target.value)}
            rows={2}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
          <TextAreaField
            label="?대떦 洹몃옒?꾨? ?좏깮???댁쑀瑜??묒꽦?섏꽭??"
            hint="?몛 (?곗씠?곗쓽 ?뱀꽦怨??곌껐?섏뿬 ?ㅻ챸)"
            value={graphSelectionReason}
            onChange={(e) => setGraphSelectionReason(e.target.value)}
            rows={4}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
        </div>

        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">???곗씠???댁꽍 (?듭떖)</h2>
          <TextAreaField
            label="洹몃옒?꾨? 諛뷀깢?쇰줈 ?곗씠?곗쓽 蹂??異붿씠, ?뱀쭠, 誘몃옒 ?덉륫, ?ы쉶???섎?瑜??ы븿?섏뿬 5臾몄옣 ?댁긽???꾩꽦??湲濡??묒꽦?섏꽭??"
            value={dataInterpretation}
            onChange={(e) => setDataInterpretation(e.target.value)}
            rows={10}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
        </div>

        <div className="mt-8 rounded-xl border border-orange-200 bg-orange-50 px-5 py-4 text-center text-gray-800">
          <p className="text-base font-semibold">?뚯씪 ?쒖텧? ?좎깮?섏쓽 ?덈궡瑜??곕Ⅴ?몄슂.</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 text-white text-lg font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] ${
            isSubmitting ? 'bg-teal-400 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
          }`}
        >
          {isSubmitting ? '?꾩넚 以?..' : '理쒖쥌 ?쒖텧?섍린'}
        </button>
      </form>
      </div>
    </div>
  );
}

