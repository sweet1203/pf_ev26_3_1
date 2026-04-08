import React, { useMemo, useState } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { TextAreaField } from '../components/TextAreaField.jsx';
import { getClientSubmissionMeta } from '../clientDeviceMeta.js';
import { createTextGuards } from '../formGuards.js';
import { postToGoogleSheet } from '../sheetSubmit.js';
import { CLASS_OPTIONS_GRADE3, GOOGLE_SHEET_TAB_GRADE3 } from '../constants.js';
import { validateSubmissionIdentity } from '../validateStudentId.js';

const ANALYSIS_TECHNIQUE_OPTIONS = [
  { value: 'two_groups', label: '두 집단 비교' },
  { value: 'two_variables', label: '두 변수의 관계 분석' },
  { value: 'distribution', label: '데이터 분포 확인' },
];

function buildTextDataPayload(state) {
  const {
    dataName,
    dataContentAndVariables,
    categoricalNumericVariables,
    curiosityQuestion,
    analysisPurposeOneSentence,
    analysisTechnique,
    analysisTechniqueReason,
    basicStats,
    dataFeaturesThreePlus,
    chartUsed,
    chartSelectionReason,
    chartInterpretation,
    finalConclusion,
    interpretationCaveats,
  } = state;
  const techniqueLabel = ANALYSIS_TECHNIQUE_OPTIONS.find((o) => o.value === analysisTechnique)?.label || '';
  return {
    dataName,
    dataContentAndVariables,
    categoricalNumericVariables,
    curiosityQuestion,
    analysisPurposeOneSentence,
    analysisTechnique,
    analysisTechniqueLabel: techniqueLabel,
    analysisTechniqueReason,
    basicStats,
    dataFeaturesThreePlus,
    chartUsed,
    chartSelectionReason,
    chartInterpretation,
    finalConclusion,
    interpretationCaveats,
  };
}

export default function Grade3Submit() {
  const { showToast } = useOutletContext();
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentClass, setStudentClass] = useState('');

  const [dataName, setDataName] = useState('');
  const [dataContentAndVariables, setDataContentAndVariables] = useState('');
  const [categoricalNumericVariables, setCategoricalNumericVariables] = useState('');
  const [curiosityQuestion, setCuriosityQuestion] = useState('');
  const [analysisPurposeOneSentence, setAnalysisPurposeOneSentence] = useState('');
  const [analysisTechnique, setAnalysisTechnique] = useState('');
  const [analysisTechniqueReason, setAnalysisTechniqueReason] = useState('');
  const [basicStats, setBasicStats] = useState('');
  const [dataFeaturesThreePlus, setDataFeaturesThreePlus] = useState('');
  const [chartUsed, setChartUsed] = useState('');
  const [chartSelectionReason, setChartSelectionReason] = useState('');
  const [chartInterpretation, setChartInterpretation] = useState('');
  const [finalConclusion, setFinalConclusion] = useState('');
  const [interpretationCaveats, setInterpretationCaveats] = useState('');

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
    setDataContentAndVariables('');
    setCategoricalNumericVariables('');
    setCuriosityQuestion('');
    setAnalysisPurposeOneSentence('');
    setAnalysisTechnique('');
    setAnalysisTechniqueReason('');
    setBasicStats('');
    setDataFeaturesThreePlus('');
    setChartUsed('');
    setChartSelectionReason('');
    setChartInterpretation('');
    setFinalConclusion('');
    setInterpretationCaveats('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const identity = validateSubmissionIdentity(studentId, studentName, studentClass);
    if (!identity.ok) {
      showToast(identity.message, 'error');
      return;
    }

    const textData = buildTextDataPayload({
      dataName,
      dataContentAndVariables,
      categoricalNumericVariables,
      curiosityQuestion,
      analysisPurposeOneSentence,
      analysisTechnique,
      analysisTechniqueReason,
      basicStats,
      dataFeaturesThreePlus,
      chartUsed,
      chartSelectionReason,
      chartInterpretation,
      finalConclusion,
      interpretationCaveats,
    });

    setIsSubmitting(true);
    try {
      const ts = Date.now();
      const sheetPayload = {
        gradeLevel: 3,
        sheetName: GOOGLE_SHEET_TAB_GRADE3,
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
    'w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all';

  return (
    <div
      onContextMenu={(e) => e.preventDefault()}
      className="-mx-4 -my-8 min-h-screen px-4 py-8"
    >
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-orange-500 p-6 text-white text-center relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-sm font-medium text-orange-100 mb-1">3학년 · 빅데이터분석</p>
          <h1 className="text-3xl font-bold mb-2">수행평가 제출</h1>
        </div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-400 rounded-full opacity-50" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-orange-600 rounded-full opacity-50" />
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 leading-relaxed">
          <p className="font-semibold text-amber-900 mb-1">📌 채점 안내</p>
          <p>
            각 문항은 단순 작성이 아니라{' '}
            <span className="font-semibold">👉 &apos;데이터를 근거로 설명&apos;</span>해야 합니다. 수치 없이 작성하면 감점됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              학번 <span className="text-red-500">*</span>
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
              이름 <span className="text-red-500">*</span>
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
            반 <span className="text-red-500">*</span>
            <span className="font-normal text-gray-500 ml-1">(해당 분반 하나만 선택)</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CLASS_OPTIONS_GRADE3.map((opt) => (
              <label
                key={opt}
                className={`flex cursor-pointer items-center justify-center rounded-lg border px-3 py-3 text-center text-sm font-medium transition-colors ${
                  studentClass === opt ? 'border-orange-500 bg-orange-50 text-orange-900' : 'border-gray-200 bg-white text-gray-800 hover:border-orange-300'
                }`}
              >
                <input
                  type="radio"
                  name="studentClass"
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

        <div className="flex items-center gap-2 mb-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-100">
          <AlertCircle size={16} />
          <span>
            <strong>주의:</strong> 모든 텍스트 입력칸은 복사/붙여넣기가 금지되어 있습니다. 직접 작성해주세요.
          </span>
        </div>

        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">① 데이터 이해 + 분석 목적</h2>
          <TextAreaField
            label="선택한 데이터의 이름은 무엇인가요?"
            value={dataName}
            onChange={(e) => setDataName(e.target.value)}
            rows={2}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
          <TextAreaField
            label="해당 데이터는 어떤 내용을 담고 있나요? (주요 변수와 함께 2~3문장으로 설명하세요)"
            value={dataContentAndVariables}
            onChange={(e) => setDataContentAndVariables(e.target.value)}
            rows={4}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
          <TextAreaField
            label="이 데이터에 포함된 변수 중 범주형 변수와 수치형 변수를 각각 1개 이상 작성하세요."
            value={categoricalNumericVariables}
            onChange={(e) => setCategoricalNumericVariables(e.target.value)}
            rows={3}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
          <TextAreaField
            label="이 데이터를 통해 무엇을 알고 싶나요? (자신의 궁금증을 작성하세요)"
            value={curiosityQuestion}
            onChange={(e) => setCuriosityQuestion(e.target.value)}
            rows={3}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
          <TextAreaField
            label="분석 목적을 한 문장으로 작성하세요."
            hint='👉 (예: "○○와 ○○의 관계를 분석하고자 한다")'
            value={analysisPurposeOneSentence}
            onChange={(e) => setAnalysisPurposeOneSentence(e.target.value)}
            rows={2}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
        </div>

        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">② 분석기법 선정 (데이터 해석 방법 선택)</h2>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              다음 중 자신의 분석 목적에 가장 적절한 분석 방법을 선택하세요
            </p>
            <div className="space-y-2">
              {ANALYSIS_TECHNIQUE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-3 cursor-pointer rounded-lg border bg-white px-4 py-3 text-sm text-gray-800 hover:border-orange-300 ${
                    analysisTechnique === opt.value ? 'border-orange-500 bg-orange-50/60' : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="analysisTechnique"
                    value={opt.value}
                    checked={analysisTechnique === opt.value}
                    onChange={() => setAnalysisTechnique(opt.value)}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <span>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>
          <TextAreaField
            label="위 분석 방법을 선택한 이유를 작성하세요."
            hint="👉 (데이터의 특성과 분석 목적을 함께 설명)"
            value={analysisTechniqueReason}
            onChange={(e) => setAnalysisTechniqueReason(e.target.value)}
            rows={4}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
        </div>

        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">③ 기초 통계 분석</h2>
          <TextAreaField
            label="데이터의 특징을 나타내는 변수들의 기초 통계값(평균, 중앙값, 최댓값, 최솟값, 표준편차 등)을 정리하여 작성하세요."
            value={basicStats}
            onChange={(e) => setBasicStats(e.target.value)}
            rows={4}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
          <TextAreaField
            label="위 통계값을 바탕으로, 데이터의 특징을 수치 근거를 포함하여 3가지 이상 설명하세요."
            value={dataFeaturesThreePlus}
            onChange={(e) => setDataFeaturesThreePlus(e.target.value)}
            rows={5}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
        </div>

        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">④ 시각화 및 해석</h2>
          <TextAreaField
            label="어떤 그래프를 사용했나요?"
            value={chartUsed}
            onChange={(e) => setChartUsed(e.target.value)}
            rows={2}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
          <TextAreaField
            label="해당 그래프를 선택한 이유는 무엇인가요?"
            value={chartSelectionReason}
            onChange={(e) => setChartSelectionReason(e.target.value)}
            rows={3}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
          <TextAreaField
            label="그래프를 통해 알 수 있는 내용을 ‘해석 중심’으로 작성하세요. (단순 설명 X)"
            value={chartInterpretation}
            onChange={(e) => setChartInterpretation(e.target.value)}
            rows={4}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
        </div>

        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">⑤ 분석 결과 및 검증 (핵심)</h2>
          <TextAreaField
            label="분석을 통해 무엇을 알게 되었으며, 최종 결론은 무엇인가요?"
            value={finalConclusion}
            onChange={(e) => setFinalConclusion(e.target.value)}
            rows={5}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
          <TextAreaField
            label="이 결과를 해석할 때 주의해야 할 점은 무엇인가요?"
            hint="👉 (예: 상관관계와 인과관계 구분, 데이터 한계, 이상치 영향 등)"
            value={interpretationCaveats}
            onChange={(e) => setInterpretationCaveats(e.target.value)}
            rows={4}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
            onBeforeInput={handleBeforeInput}
          />
        </div>

        <div className="mt-8 rounded-xl border border-orange-200 bg-orange-50 px-5 py-4 text-center text-gray-800 space-y-2">
          <p className="text-base font-semibold">파일 제출은 선생님의 안내를 따르세요.</p>
          <p className="text-sm text-gray-600">
            <Link
              to="/datasets/assessment/grade3"
              className="font-semibold text-orange-700 underline-offset-2 hover:underline"
            >
              3학년용 수행평가 데이터셋 안내·다운로드
            </Link>
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 text-white text-lg font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] ${
            isSubmitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
          }`}
        >
          {isSubmitting ? '전송 중...' : '최종 제출하기'}
        </button>
      </form>
      </div>
    </div>
  );
}
