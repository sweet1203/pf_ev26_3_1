import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, X, Settings, Lock, Clock, ChevronRight, User, Download } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';

// ------------------------------
// 환경에 따른 Firebase 스마트 초기화
// ------------------------------
let firebaseConfig = {};

// Canvas 환경 확인 (window 객체 사용)
if (typeof window !== 'undefined' && window.__firebase_config) {
  try {
    firebaseConfig = JSON.parse(window.__firebase_config);
  } catch (e) {
    console.error("Firebase config parsing error:", e);
  }
} else {
  // Vite: 프로젝트 루트에 .env 파일로 VITE_FIREBASE_* 설정 (env.example 참고)
  firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '선생님의_API_KEY',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '선생님의_AUTH_DOMAIN',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '선생님의_PROJECT_ID',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '선생님의_STORAGE_BUCKET',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '선생님의_MESSAGING_SENDER_ID',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '선생님의_APP_ID',
  };
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 데이터베이스 경로 설정 (Canvas 규격 vs Vercel 일반 규격)
const appId = (typeof window !== 'undefined' && window.__app_id) ? window.__app_id : 'my-school-app';
const collectionPath = (typeof window !== 'undefined' && window.__app_id)
  ? `artifacts/${appId}/public/data/submissions` 
  : 'submissions';

// 구글 앱스 스크립트 웹앱은 브라우저 CORS 제한이 있어 mode: 'no-cors' 로 보내야 시트에 도달하는 경우가 많습니다.
const DEFAULT_GOOGLE_SHEET_WEBHOOK =
  'https://script.google.com/macros/s/AKfycbz6AkbByJ7sGh4qScx-27YzvAxwpP48djzx5VNIT2hE7v9qxvUBjPNfLdvyF8rZ1kRv/exec';

async function postToGoogleSheet(payload) {
  const url = (import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL || DEFAULT_GOOGLE_SHEET_WEBHOOK).trim();
  if (!url) return;
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('구글 시트 저장 실패:', err);
  }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('student'); // 'student' | 'teacher_login' | 'teacher_dashboard'
  const [toast, setToast] = useState(null);

  // Firebase Auth 초기화
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Auth Error:", error);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans text-gray-800">
      {/* 화면 전환 네비게이션 */}
      <div className="max-w-4xl mx-auto mb-4 flex justify-end">
        {view === 'student' ? (
          <button 
            onClick={() => setView('teacher_login')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200"
          >
            <Settings size={16} /> 선생님 페이지
          </button>
        ) : (
          <button 
            onClick={() => setView('student')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-600 transition-colors bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-200"
          >
            <User size={16} /> 학생 제출 화면으로 돌아가기
          </button>
        )}
      </div>

      {/* 화면 라우팅 */}
      {view === 'student' && <StudentForm user={user} showToast={showToast} />}
      {view === 'teacher_login' && <TeacherLogin setView={setView} showToast={showToast} />}
      {view === 'teacher_dashboard' && <TeacherDashboard user={user} showToast={showToast} />}

      {/* 커스텀 Toast 알림 */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in-up">
          <div className={`flex items-center gap-2 px-6 py-3 rounded-full shadow-2xl font-medium ${
            toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
          }`}>
            {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out forwards;
        }
      `}} />
    </div>
  );
}

// ------------------------------
// 공통 컴포넌트: 텍스트 입력 필드 
// ------------------------------
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
      value={value} onChange={onChange}
      onPaste={onPaste} onDrop={onDrop}
    ></textarea>
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

/** 구(舊) 제출 문서와 호환 */
function normalizeTextData(td) {
  if (!td || typeof td !== 'object') return {};
  if (td.dataName != null || td.finalConclusion != null) return td;
  return {
    dataName: td.dataNameOrigin,
    dataContentAndVariables: td.dataDescription,
    categoricalNumericVariables: '',
    curiosityQuestion: td.analysisQuestion,
    analysisPurposeOneSentence: td.analysisPurpose,
    analysisTechnique: '',
    analysisTechniqueLabel: td.analysisMethod,
    analysisTechniqueReason: td.analysisReason,
    basicStats: td.basicStats,
    dataFeaturesThreePlus: td.dataFeatures,
    chartUsed: td.visualizationGraph,
    chartSelectionReason: '',
    chartInterpretation: td.graphInterpretation,
    finalConclusion: td.conclusion,
    interpretationCaveats: '',
  };
}

// ------------------------------
// 1. 학생 제출 폼 컴포넌트
// ------------------------------
function StudentForm({ user, showToast }) {
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
      showToast("❌ 모든 텍스트 입력칸은 복사/붙여넣기가 금지되어 있습니다. 직접 타이핑해주세요!", "error");
    }
  };

  const handleTextDrop = (e) => {
    e.preventDefault();
    showToast("❌ 텍스트 드래그 앤 드롭은 금지되어 있습니다.", "error");
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
    if (!user) {
      showToast("서버에 연결 중입니다. 잠시 후 다시 시도해주세요.", "error");
      return;
    }
    if (!studentId.trim() || !studentName.trim() || !studentClass.trim()) {
      showToast("학번, 이름, 반을 모두 입력해주세요.", "error");
      return;
    }
    if (!analysisTechnique) {
      showToast("[②] 분석 방법을 하나 선택해주세요.", "error");
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
      showToast("모든 문항을 빠짐없이 작성해주세요.", "error");
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
      await postToGoogleSheet(sheetPayload);

      const submissionsRef = collection(db, collectionPath);
      await addDoc(submissionsRef, {
        studentId,
        studentName,
        studentClass,
        textData,
        timestamp: ts,
      });

      showToast("🎉 성공적으로 제출되었습니다!", "success");
      resetForm();
    } catch (error) {
      console.error(error);
      showToast("제출 중 오류가 발생했습니다.", "error");
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
          <p className="text-orange-100">분석 보고서 내용을 작성하여 제출하세요.</p>
        </div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-400 rounded-full opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-orange-600 rounded-full opacity-50"></div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">학번 <span className="text-red-500">*</span></label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">이름 <span className="text-red-500">*</span></label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-1">반 <span className="text-red-500">*</span></label>
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
          <span><strong>주의:</strong> 모든 텍스트 입력칸은 복사/붙여넣기가 금지되어 있습니다. 직접 작성해주세요.</span>
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
          {isSubmitting ? '제출 중...' : '최종 제출하기'}
        </button>
      </form>
    </div>
  );
}

function SubmissionDetailModal({ sub, onClose }) {
  const td = normalizeTextData(sub.textData);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
          <h3 className="text-lg font-bold text-gray-800">
            {sub.studentId} {sub.studentName}
            {sub.studentClass ? ` (${sub.studentClass})` : ''} — 제출 내용
          </h3>
          <button type="button" onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-8 text-sm">
          <section>
            <h4 className="text-lg font-bold text-gray-800 mb-3">① 데이터 이해 + 분석 목적</h4>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
              <div><span className="font-semibold">선택한 데이터의 이름</span><p className="whitespace-pre-wrap mt-1">{td.dataName}</p></div>
              <div><span className="font-semibold">데이터 내용 (주요 변수 포함)</span><p className="whitespace-pre-wrap mt-1">{td.dataContentAndVariables}</p></div>
              <div><span className="font-semibold">범주형·수치형 변수</span><p className="whitespace-pre-wrap mt-1">{td.categoricalNumericVariables}</p></div>
              <div><span className="font-semibold">궁금증</span><p className="whitespace-pre-wrap mt-1">{td.curiosityQuestion}</p></div>
              <div><span className="font-semibold">분석 목적 (한 문장)</span><p className="whitespace-pre-wrap mt-1">{td.analysisPurposeOneSentence}</p></div>
            </div>
          </section>

          <section>
            <h4 className="text-lg font-bold text-gray-800 mb-3">② 분석기법 선정</h4>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
              <div><span className="font-semibold">선택한 분석 방법</span><p className="whitespace-pre-wrap mt-1">{td.analysisTechniqueLabel || '—'}</p></div>
              <div><span className="font-semibold">선택 이유</span><p className="whitespace-pre-wrap mt-1">{td.analysisTechniqueReason}</p></div>
            </div>
          </section>

          <section>
            <h4 className="text-lg font-bold text-gray-800 mb-3">③ 기초 통계 분석</h4>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
              <div><span className="font-semibold">기초 통계값</span><p className="whitespace-pre-wrap mt-1">{td.basicStats}</p></div>
              <div><span className="font-semibold">데이터 특징 (3가지 이상)</span><p className="whitespace-pre-wrap mt-1">{td.dataFeaturesThreePlus}</p></div>
            </div>
          </section>

          <section>
            <h4 className="text-lg font-bold text-gray-800 mb-3">④ 시각화 및 해석</h4>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
              <div><span className="font-semibold">사용한 그래프</span><p className="whitespace-pre-wrap mt-1">{td.chartUsed}</p></div>
              <div><span className="font-semibold">그래프 선택 이유</span><p className="whitespace-pre-wrap mt-1">{td.chartSelectionReason}</p></div>
              <div><span className="font-semibold">그래프 해석</span><p className="whitespace-pre-wrap mt-1">{td.chartInterpretation}</p></div>
            </div>
          </section>

          <section>
            <h4 className="text-lg font-bold text-gray-800 mb-3">⑤ 분석 결과 및 검증</h4>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
              <div><span className="font-semibold">최종 결론</span><p className="whitespace-pre-wrap mt-1">{td.finalConclusion}</p></div>
              <div><span className="font-semibold">해석 시 주의점</span><p className="whitespace-pre-wrap mt-1">{td.interpretationCaveats}</p></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

// ------------------------------
// 2. 선생님 로그인 뷰 컴포넌트
// ------------------------------
function TeacherLogin({ setView, showToast }) {
  const [pin, setPin] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === '1234') { // 기본 PIN 번호
      setView('teacher_dashboard');
      showToast("선생님 페이지에 접속했습니다.", "success");
    } else {
      showToast("비밀번호가 일치하지 않습니다.", "error");
      setPin('');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-10">
      <div className="bg-gray-800 p-6 text-white text-center">
        <Lock className="mx-auto mb-2 opacity-80" size={32} />
        <h2 className="text-2xl font-bold">교사 인증</h2>
        <p className="text-gray-400 text-sm mt-1">대시보드에 접근하려면 PIN을 입력하세요.</p>
      </div>
      <form onSubmit={handleLogin} className="p-8 space-y-6">
        <div>
          <input 
            type="password" placeholder="비밀번호 (기본: 1234)"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-800 focus:outline-none text-center tracking-[0.5em] text-lg font-bold"
            value={pin} onChange={(e) => setPin(e.target.value)} autoFocus
          />
        </div>
        <button type="submit" className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl shadow-md transition-all">
          접속하기
        </button>
      </form>
    </div>
  );
}

// ------------------------------
// 3. 선생님 대시보드 (데이터 확인) 컴포넌트
// ------------------------------
function TeacherDashboard({ user, showToast }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState(null);

  useEffect(() => {
    if (!user) return;
    
    const submissionsRef = collection(db, collectionPath);
    const unsubscribe = onSnapshot(submissionsRef, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      data.sort((a, b) => b.timestamp - a.timestamp);
      setSubmissions(data);
      setLoading(false);
    }, (error) => {
      console.error(error);
      showToast("데이터를 불러오는데 실패했습니다.", "error");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const d = new Date(timestamp);
    return `${d.getMonth()+1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;
  };

  const downloadCSV = () => {
    if (submissions.length === 0) {
      showToast("다운로드할 데이터가 없습니다.", "error");
      return;
    }

    const csvCell = (v) => {
      const s = v == null ? '' : String(v);
      return `"${s.replace(/"/g, '""').replace(/\r\n|\r|\n/g, ' ')}"`;
    };

    const headers = [
      '제출일시',
      '학번',
      '이름',
      '반',
      '①_선택한데이터이름',
      '①_데이터내용_주요변수포함',
      '①_범주형수치형변수',
      '①_궁금증',
      '①_분석목적_한문장',
      '②_선택한분석방법',
      '②_분석방법선택이유',
      '③_기초통계값',
      '③_데이터특징_3가지이상',
      '④_사용그래프',
      '④_그래프선택이유',
      '④_그래프해석',
      '⑤_최종결론',
      '⑤_해석시주의점',
    ];

    const lines = [headers.join(',')];
    submissions.forEach((sub) => {
      const td = normalizeTextData(sub.textData);
      const technique = td.analysisTechniqueLabel || td.analysisTechnique || '';
      lines.push(
        [
          formatDate(sub.timestamp),
          sub.studentId,
          sub.studentName,
          sub.studentClass ?? '',
          td.dataName,
          td.dataContentAndVariables,
          td.categoricalNumericVariables,
          td.curiosityQuestion,
          td.analysisPurposeOneSentence,
          technique,
          td.analysisTechniqueReason,
          td.basicStats,
          td.dataFeaturesThreePlus,
          td.chartUsed,
          td.chartSelectionReason,
          td.chartInterpretation,
          td.finalConclusion,
          td.interpretationCaveats,
        ]
          .map(csvCell)
          .join(',')
      );
    });

    const csvContent = `\uFEFF${lines.join('\n')}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `수행평가_제출결과_${new Date().toLocaleDateString().replace(/\./g, '').replace(/ /g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast("엑셀(CSV) 파일 다운로드가 시작되었습니다.", "success");
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gray-800 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">제출 현황 대시보드</h1>
            <p className="text-gray-400 mt-1">총 {submissions.length}건의 데이터가 접수되었습니다.</p>
          </div>
          <button 
            onClick={downloadCSV}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-semibold transition-colors shadow-sm"
          >
            <Download size={18} />
            엑셀 다운로드
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-500">데이터를 불러오는 중입니다...</div>
        ) : submissions.length === 0 ? (
          <div className="p-10 text-center text-gray-500">아직 제출된 과제가 없습니다.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                  <th className="p-4 font-semibold">학번</th>
                  <th className="p-4 font-semibold">이름</th>
                  <th className="p-4 font-semibold">반</th>
                  <th className="p-4 font-semibold">제출일시</th>
                  <th className="p-4 font-semibold text-center">상세보기</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800">{sub.studentId}</td>
                    <td className="p-4">{sub.studentName}</td>
                    <td className="p-4 text-gray-600">{sub.studentClass ?? '—'}</td>
                    <td className="p-4 text-gray-500 text-sm">
                      <span className="flex items-center gap-1"><Clock size={14} /> {formatDate(sub.timestamp)}</span>
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => setSelectedSub(sub)}
                        className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-colors inline-block"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 과제 상세내용 모달 */}
      {selectedSub && (
        <SubmissionDetailModal sub={selectedSub} onClose={() => setSelectedSub(null)} />
      )}
    </div>
  );
}