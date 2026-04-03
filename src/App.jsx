import React, { useState } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';

// 구글 앱스 스크립트 웹앱: 브라우저 CORS 때문에 mode: 'no-cors' 사용
const DEFAULT_GOOGLE_SHEET_WEBHOOK =
  'https://script.google.com/macros/s/AKfycbz6AkbByJ7sGh4qScx-27YzvAxwpP48djzx5VNIT2hE7v9qxvUBjPNfLdvyF8rZ1kRv/exec';

async function postToGoogleSheet(payload) {
  const url = (import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL || DEFAULT_GOOGLE_SHEET_WEBHOOK).trim();
  if (!url) {
    return {
      ok: false,
      message: '.env에 VITE_GOOGLE_SHEET_WEBHOOK_URL(웹앱 /exec 주소)을 설정하세요.',
    };
  }
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return { ok: true };
  } catch (err) {
    console.error('구글 시트 전송 실패:', err);
    return { ok: false, message: '전송 중 오류가 발생했습니다. 네트워크를 확인하세요.' };
  }
}

export default function App() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans text-gray-800">
      <StudentForm showToast={showToast} />

      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
          <div
            className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl font-medium ${
              toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `,
        }}
      />
    </div>
  );
}

const TextAreaField = ({ label, hint, value, onChange, placeholder, required = false, rows = 3, onPaste, onDrop }) => (
  <div className="relative">
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {hint ? <p className="text-xs text-gray-500 mb-2 leading-relaxed">{hint}</p> : null}
    <textarea
      rows={rows}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all resize-y"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onPaste={onPaste}
      onDrop={onDrop}
    />
  </div>
);

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

function StudentForm({ showToast }) {
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

  const handleTextPaste = (e) => {
    const pastedText = e.clipboardData.getData('text/plain');
    if (pastedText && pastedText.trim() !== '') {
      e.preventDefault();
      showToast('❌ 모든 텍스트 입력칸은 복사/붙여넣기가 금지되어 있습니다. 직접 타이핑해주세요!', 'error');
    }
  };

  const handleTextDrop = (e) => {
    e.preventDefault();
    showToast('❌ 텍스트 드래그 앤 드롭은 금지되어 있습니다.', 'error');
  };

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
    if (!studentId.trim() || !studentName.trim() || !studentClass.trim()) {
      showToast('학번, 이름, 반을 모두 입력해주세요.', 'error');
      return;
    }
    if (!analysisTechnique) {
      showToast('[②] 분석 방법을 하나 선택해주세요.', 'error');
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

    const requiredEmpty = Object.entries(textData).some(([key, v]) => {
      if (key === 'analysisTechniqueLabel') return false;
      return typeof v === 'string' && !v.trim();
    });
    if (requiredEmpty) {
      showToast('모든 문항을 빠짐없이 작성해주세요.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const ts = Date.now();
      const sheetPayload = {
        studentId,
        studentName,
        studentClass,
        timestamp: new Date(ts).toLocaleString('ko-KR'),
        textData,
      };
      const result = await postToGoogleSheet(sheetPayload);
      if (!result.ok) {
        showToast(result.message, 'error');
        return;
      }
      showToast('🎉 제출되었습니다. 스프레드시트에 기록되었습니다.', 'success');
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all';

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-orange-500 p-6 text-white text-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">빅데이터 분석 수행평가 제출</h1>
          <p className="text-orange-100">작성 후 제출하면 구글 스프레드시트에만 저장됩니다.</p>
        </div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-400 rounded-full opacity-50" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-orange-600 rounded-full opacity-50" />
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              학번 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="예: 20101"
              className={inputClass}
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              onPaste={handleTextPaste}
              onDrop={handleTextDrop}
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
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              반 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="예: 1반"
              className={inputClass}
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              onPaste={handleTextPaste}
              onDrop={handleTextDrop}
            />
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
            required
            rows={2}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
          />
          <TextAreaField
            label="해당 데이터는 어떤 내용을 담고 있나요? (주요 변수와 함께 2~3문장으로 설명하세요)"
            value={dataContentAndVariables}
            onChange={(e) => setDataContentAndVariables(e.target.value)}
            required
            rows={4}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
          />
          <TextAreaField
            label="이 데이터에 포함된 변수 중 범주형 변수와 수치형 변수를 각각 1개 이상 작성하세요."
            value={categoricalNumericVariables}
            onChange={(e) => setCategoricalNumericVariables(e.target.value)}
            required
            rows={3}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
          />
          <TextAreaField
            label="이 데이터를 통해 무엇을 알고 싶나요? (자신의 궁금증을 작성하세요)"
            value={curiosityQuestion}
            onChange={(e) => setCuriosityQuestion(e.target.value)}
            required
            rows={3}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
          />
          <TextAreaField
            label="분석 목적을 한 문장으로 작성하세요."
            hint='👉 (예: "○○와 ○○의 관계를 분석하고자 한다")'
            value={analysisPurposeOneSentence}
            onChange={(e) => setAnalysisPurposeOneSentence(e.target.value)}
            required
            rows={2}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
          />
        </div>

        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">② 분석기법 선정 (데이터 해석 방법 선택)</h2>
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">
              다음 중 자신의 분석 목적에 가장 적절한 분석 방법을 선택하세요 <span className="text-red-500">*</span>
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
            required
            rows={4}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
          />
        </div>

        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">③ 기초 통계 분석</h2>
          <TextAreaField
            label="선택한 변수의 기초 통계값(평균, 중앙값, 최댓값, 최솟값 등)을 정리하여 작성하세요."
            value={basicStats}
            onChange={(e) => setBasicStats(e.target.value)}
            required
            rows={4}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
          />
          <TextAreaField
            label="위 통계값을 바탕으로 데이터의 특징을 3가지 이상 설명하세요."
            hint="👉 (반드시 수치를 포함하여 설명)"
            value={dataFeaturesThreePlus}
            onChange={(e) => setDataFeaturesThreePlus(e.target.value)}
            required
            rows={5}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
          />
        </div>

        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">④ 시각화 및 해석</h2>
          <TextAreaField
            label="어떤 그래프를 사용했나요?"
            value={chartUsed}
            onChange={(e) => setChartUsed(e.target.value)}
            required
            rows={2}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
          />
          <TextAreaField
            label="해당 그래프를 선택한 이유는 무엇인가요?"
            value={chartSelectionReason}
            onChange={(e) => setChartSelectionReason(e.target.value)}
            required
            rows={3}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
          />
          <TextAreaField
            label="그래프를 통해 알 수 있는 내용은 무엇인가요?"
            hint='👉 (단순 설명이 아니라 "해석" 작성)'
            value={chartInterpretation}
            onChange={(e) => setChartInterpretation(e.target.value)}
            required
            rows={4}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
          />
        </div>

        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">⑤ 분석 결과 및 검증 (핵심)</h2>
          <TextAreaField
            label="분석을 통해 무엇을 알게 되었으며, 최종 결론은 무엇인가요?"
            value={finalConclusion}
            onChange={(e) => setFinalConclusion(e.target.value)}
            required
            rows={5}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
          />
          <TextAreaField
            label="이 결과를 해석할 때 주의해야 할 점은 무엇인가요?"
            hint="👉 (예: 상관관계와 인과관계 구분, 데이터 한계, 이상치 영향 등)"
            value={interpretationCaveats}
            onChange={(e) => setInterpretationCaveats(e.target.value)}
            required
            rows={4}
            onPaste={handleTextPaste}
            onDrop={handleTextDrop}
          />
        </div>

        <div className="mt-8 rounded-xl border border-orange-200 bg-orange-50 px-5 py-4 text-center text-gray-800">
          <p className="text-base font-semibold">파일은 리로스쿨에 제출하세요.</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 text-white text-lg font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] ${
            isSubmitting ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'
          }`}
        >
          {isSubmitting ? '전송 중...' : '최종 제출하기 (스프레드시트)'}
        </button>
      </form>
    </div>
  );
}
