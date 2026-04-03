import React, { useState, useEffect, useRef } from 'react';
import { Upload, Image as ImageIcon, FileText, AlertCircle, CheckCircle, X, Settings, Lock, Clock, ChevronRight, User, Download, FileBox } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
const storage = getStorage(app);

function sanitizeStorageFileName(name) {
  return String(name).replace(/[/\\?%*:|"<>]/g, '_').slice(0, 180);
}

async function uploadFileToStorage(fullStoragePath, file, contentType) {
  const sref = ref(storage, fullStoragePath);
  await uploadBytes(sref, file, { contentType: contentType || file.type || 'application/octet-stream' });
  return getDownloadURL(sref);
}

async function dataUrlToBlob(dataUrl) {
  const res = await fetch(dataUrl);
  return res.blob();
}

// 데이터베이스 경로 설정 (Canvas 규격 vs Vercel 일반 규격)
const appId = (typeof window !== 'undefined' && window.__app_id) ? window.__app_id : 'my-school-app';
const collectionPath = (typeof window !== 'undefined' && window.__app_id)
  ? `artifacts/${appId}/public/data/submissions` 
  : 'submissions';

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
const TextAreaField = ({ label, value, onChange, placeholder, required = false, rows = 3, onPaste, onDrop }) => (
  <div className="relative">
    <label className="block text-sm font-semibold text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea 
      rows={rows}
      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all resize-y"
      placeholder={placeholder}
      value={value} onChange={onChange}
      onPaste={onPaste} onDrop={onDrop}
    ></textarea>
  </div>
);

// ------------------------------
// 1. 학생 제출 폼 컴포넌트
// ------------------------------
function StudentForm({ user, showToast }) {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  
  // 세부 텍스트 입력 필드 상태 관리
  const [dataNameOrigin, setDataNameOrigin] = useState('');
  const [dataDescription, setDataDescription] = useState('');
  const [analysisQuestion, setAnalysisQuestion] = useState('');
  const [analysisPurpose, setAnalysisPurpose] = useState('');
  const [analysisMethod, setAnalysisMethod] = useState('');
  const [analysisReason, setAnalysisReason] = useState('');
  const [basicStats, setBasicStats] = useState('');
  const [dataFeatures, setDataFeatures] = useState('');
  const [visualizationGraph, setVisualizationGraph] = useState('');
  const [graphInterpretation, setGraphInterpretation] = useState('');
  const [conclusion, setConclusion] = useState('');

  const [images, setImages] = useState([]);
  const [dataFiles, setDataFiles] = useState([]);
  const [orangeFiles, setOrangeFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dataFileInputRef = useRef(null);
  const orangeFileInputRef = useRef(null);

  // 이미지 압축
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.7)); 
        };
      };
    });
  };

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

  useEffect(() => {
    const handleGlobalPaste = async (e) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      let imageFound = false;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          imageFound = true;
          const blob = items[i].getAsFile();
          const url = URL.createObjectURL(blob);
          const base64 = await compressImage(blob);
          
          setImages(prev => [...prev, { 
            url, 
            base64,
            name: `캡처_이미지_${new Date().getTime()}.jpg` 
          }]);
        }
      }
      
      if (imageFound) {
        showToast("✅ 이미지가 성공적으로 첨부되었습니다.", "success");
      }
    };

    window.addEventListener('paste', handleGlobalPaste);
    return () => window.removeEventListener('paste', handleGlobalPaste);
  }, []);

  const handleDataFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).map((f) => ({
      file: f,
      name: f.name,
      size: f.size,
    }));

    if (selectedFiles.length > 0) {
      setDataFiles((prev) => [...prev, ...selectedFiles]);
      showToast(`✅ ${selectedFiles.length}개의 데이터 파일이 첨부되었습니다.`, 'success');
    }
    e.target.value = null;
  };

  const handleOrangeFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).map((f) => ({
      file: f,
      name: f.name,
      size: f.size,
    }));

    if (selectedFiles.length > 0) {
      setOrangeFiles((prev) => [...prev, ...selectedFiles]);
      showToast(`✅ ${selectedFiles.length}개의 오렌지3 파일이 첨부되었습니다.`, 'success');
    }
    e.target.value = null;
  };

  const removeImage = (index) => setImages(prev => prev.filter((_, i) => i !== index));
  const removeDataFile = (index) => setDataFiles(prev => prev.filter((_, i) => i !== index));
  const removeOrangeFile = (index) => setOrangeFiles(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      showToast("서버에 연결 중입니다. 잠시 후 다시 시도해주세요.", "error");
      return;
    }
    if (!studentId || !studentName) {
      showToast("학번과 이름을 입력해주세요.", "error");
      return;
    }
    
    if (!dataNameOrigin || !analysisPurpose || !conclusion) {
      showToast("필수 항목을 모두 작성해주세요.", "error");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const ts = Date.now();
      const safeStudent = sanitizeStorageFileName(studentId || 'unknown');
      const basePath = `submissions/${user.uid}_${safeStudent}_${ts}`;

      const imageEntries = [];
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        const blob = await dataUrlToBlob(img.base64);
        const safeName = sanitizeStorageFileName(img.name || `image_${i}.jpg`);
        const path = `${basePath}/images/${i}_${safeName}`;
        const url = await uploadFileToStorage(path, blob, 'image/jpeg');
        imageEntries.push({ url, name: img.name || `image_${i}.jpg` });
      }

      const dataFileEntries = [];
      for (let i = 0; i < dataFiles.length; i++) {
        const item = dataFiles[i];
        const safeName = sanitizeStorageFileName(item.name);
        const path = `${basePath}/data/${i}_${safeName}`;
        const url = await uploadFileToStorage(path, item.file);
        dataFileEntries.push({ name: item.name, size: item.size, url });
      }

      const orangeFileEntries = [];
      for (let i = 0; i < orangeFiles.length; i++) {
        const item = orangeFiles[i];
        const safeName = sanitizeStorageFileName(item.name);
        const path = `${basePath}/orange/${i}_${safeName}`;
        const url = await uploadFileToStorage(path, item.file);
        orangeFileEntries.push({ name: item.name, size: item.size, url });
      }

      const submissionsRef = collection(db, collectionPath);
      await addDoc(submissionsRef, {
        studentId,
        studentName,
        textData: {
          dataNameOrigin, dataDescription, analysisQuestion,
          analysisPurpose, analysisMethod, analysisReason,
          basicStats, dataFeatures, visualizationGraph,
          graphInterpretation, conclusion
        },
        images: imageEntries,
        dataFiles: dataFileEntries,
        orangeFiles: orangeFileEntries,
        storagePath: basePath,
        timestamp: ts,
      });
      
      // 2. 구글 시트로 데이터 자동 전송
      const googleSheetUrl = 'https://script.google.com/macros/s/AKfycbz6AkbByJ7sGh4qScx-27YzvAxwpP48djzx5VNIT2hE7v9qxvUBjPNfLdvyF8rZ1kRv/exec';
      fetch(googleSheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          studentId,
          studentName,
          timestamp: new Date().toLocaleString(),
          textData: {
            dataNameOrigin, dataDescription, analysisQuestion,
            analysisPurpose, analysisMethod, analysisReason,
            basicStats, dataFeatures, visualizationGraph,
            graphInterpretation, conclusion
          }
        })
      }).catch(err => console.error("구글 시트 저장 실패:", err));

      showToast("🎉 성공적으로 제출되었습니다!", "success");
      
      // 폼 초기화
      setStudentId(''); setStudentName('');
      setDataNameOrigin(''); setDataDescription(''); setAnalysisQuestion('');
      setAnalysisPurpose(''); setAnalysisMethod(''); setAnalysisReason('');
      setBasicStats(''); setDataFeatures(''); setVisualizationGraph('');
      setGraphInterpretation(''); setConclusion('');
      setImages([]); setDataFiles([]); setOrangeFiles([]);
    } catch (error) {
      console.error(error);
      showToast("제출 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-orange-500 p-6 text-white text-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">빅데이터 분석 수행평가 제출</h1>
          <p className="text-orange-100">분석 보고서와 실습 파일을 제출하세요.</p>
        </div>
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-400 rounded-full opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-orange-600 rounded-full opacity-50"></div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">학번</label>
            <input 
              type="text" placeholder="예: 20101"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
              value={studentId} onChange={(e) => setStudentId(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">이름</label>
            <input 
              type="text" placeholder="홍길동"
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
              value={studentName} onChange={(e) => setStudentName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mb-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-lg border border-orange-100">
          <AlertCircle size={16} />
          <span><strong>주의:</strong> 모든 텍스트 입력칸은 복사/붙여넣기가 금지되어 있습니다. 직접 작성해주세요.</span>
        </div>

        {/* Ⅰ. 데이터 이해 및 분석 설계 */}
        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ⅰ. 데이터 이해 및 분석 설계</h2>
          <TextAreaField label="1. 선택한 데이터의 이름과 출처" value={dataNameOrigin} onChange={(e) => setDataNameOrigin(e.target.value)} required rows={2} onPaste={handleTextPaste} onDrop={handleTextDrop} />
          <TextAreaField label="2. 해당 데이터는 어떤 내용을 담고 있나요? (2~3문장)" value={dataDescription} onChange={(e) => setDataDescription(e.target.value)} rows={3} onPaste={handleTextPaste} onDrop={handleTextDrop} />
          <TextAreaField label="3. 이 데이터를 통해 무엇을 알고 싶나요? (분석 질문 작성)" value={analysisQuestion} onChange={(e) => setAnalysisQuestion(e.target.value)} rows={2} onPaste={handleTextPaste} onDrop={handleTextDrop} />
          <TextAreaField label="4. 분석 목적을 한 문장으로 작성하세요" value={analysisPurpose} onChange={(e) => setAnalysisPurpose(e.target.value)} required rows={2} onPaste={handleTextPaste} onDrop={handleTextDrop} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextAreaField label="5. 어떤 분석 방법을 선택했나요?" value={analysisMethod} onChange={(e) => setAnalysisMethod(e.target.value)} rows={2} onPaste={handleTextPaste} onDrop={handleTextDrop} />
            <TextAreaField label="6. 해당 분석 방법을 선택한 이유는 무엇인가요?" value={analysisReason} onChange={(e) => setAnalysisReason(e.target.value)} rows={3} onPaste={handleTextPaste} onDrop={handleTextDrop} />
          </div>
        </div>

        {/* Ⅱ. 데이터 분석 및 시각화 */}
        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ⅱ. 데이터 분석 및 시각화</h2>
          <TextAreaField label="7. 관심있는 변수의 기초 통계값(평균, 중앙값, 최댓값, 최솟값 등)을 정리하여 작성하세요" value={basicStats} onChange={(e) => setBasicStats(e.target.value)} rows={4} onPaste={handleTextPaste} onDrop={handleTextDrop} />
          <TextAreaField label="8. 위 통계값을 바탕으로 데이터의 특징을 3가지 이상 설명하세요" value={dataFeatures} onChange={(e) => setDataFeatures(e.target.value)} rows={4} onPaste={handleTextPaste} onDrop={handleTextDrop} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextAreaField label="9. 어떤 시각화 그래프를 사용했나요?" value={visualizationGraph} onChange={(e) => setVisualizationGraph(e.target.value)} rows={2} onPaste={handleTextPaste} onDrop={handleTextDrop} />
            <TextAreaField label="10. 그래프를 통해 알 수 있는 내용은 무엇인가요?" value={graphInterpretation} onChange={(e) => setGraphInterpretation(e.target.value)} rows={3} onPaste={handleTextPaste} onDrop={handleTextDrop} />
          </div>
        </div>

        {/* Ⅲ. 결론 */}
        <div className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Ⅲ. 결론</h2>
          <TextAreaField label="11. 분석을 통해 무엇을 알게 되었으며, 최종 결론은 무엇인가요?" value={conclusion} onChange={(e) => setConclusion(e.target.value)} required rows={5} onPaste={handleTextPaste} onDrop={handleTextDrop} />
        </div>

        {/* Ⅳ. 실습 파일 제출 */}
        <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">Ⅳ. 실습 파일 제출</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-3">
              <ImageIcon size={24} />
            </div>
            <h3 className="font-bold text-gray-700 mb-1">워크플로우 캡처</h3>
            <p className="text-xs text-gray-500 mb-3">화면 캡처 후,<br/><strong className="text-gray-700">Ctrl + V</strong>로 붙여넣기</p>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="bg-green-100 text-green-600 p-3 rounded-full mb-3">
              <Upload size={24} />
            </div>
            <h3 className="font-bold text-gray-700 mb-1">데이터 파일 (.csv 등)</h3>
            <p className="text-xs text-gray-500 mb-3">분석에 사용한<br/>원본 데이터 파일</p>
            <button 
              type="button" onClick={() => dataFileInputRef.current.click()}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg shadow-sm text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              파일 선택
            </button>
            <input type="file" multiple className="hidden" ref={dataFileInputRef} onChange={handleDataFileChange} />
          </div>

          <div className="border-2 border-dashed border-orange-300 rounded-xl p-4 flex flex-col items-center justify-center text-center bg-orange-50 hover:bg-orange-100 transition-colors">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-full mb-3">
              <FileBox size={24} />
            </div>
            <h3 className="font-bold text-gray-700 mb-1">오렌지3 파일 (.ows)</h3>
            <p className="text-xs text-gray-500 mb-3">저장한 오렌지3<br/>워크플로우 파일</p>
            <button 
              type="button" onClick={() => orangeFileInputRef.current.click()}
              className="px-3 py-1.5 bg-white border border-orange-300 rounded-lg shadow-sm text-xs font-medium text-gray-700 hover:bg-orange-50 transition-colors"
            >
              파일 선택
            </button>
            <input type="file" multiple accept=".ows" className="hidden" ref={orangeFileInputRef} onChange={handleOrangeFileChange} />
          </div>
        </div>

        {(images.length > 0 || dataFiles.length > 0 || orangeFiles.length > 0) && (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mt-4">
            <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
              <FileText size={16} /> 첨부 목록
            </h4>
            <div className="space-y-4">
              {images.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-gray-500 mb-2">이미지</h5>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <div key={`img-${idx}`} className="relative group flex-shrink-0">
                        <img src={img.url} alt="Pasted" className="h-16 w-24 object-cover rounded-lg border border-gray-300 shadow-sm" />
                        <button 
                          type="button" onClick={() => removeImage(idx)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {dataFiles.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-gray-500 mb-1">데이터 파일</h5>
                  <ul className="space-y-1">
                    {dataFiles.map((file, idx) => (
                      <li key={`dfile-${idx}`} className="flex items-center justify-between bg-white p-1.5 px-2 rounded-lg border border-gray-200 shadow-sm text-xs">
                        <span className="truncate text-gray-600 flex-1">{file.name}</span>
                        <span className="text-gray-400 ml-2 mr-2">{(file.size / 1024).toFixed(1)} KB</span>
                        <button type="button" onClick={() => removeDataFile(idx)} className="text-red-400 hover:text-red-600 transition-colors">
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {orangeFiles.length > 0 && (
                <div>
                  <h5 className="text-xs font-bold text-gray-500 mb-1">오렌지3 파일</h5>
                  <ul className="space-y-1">
                    {orangeFiles.map((file, idx) => (
                      <li key={`ofile-${idx}`} className="flex items-center justify-between bg-white p-1.5 px-2 rounded-lg border border-orange-200 shadow-sm text-xs">
                        <span className="truncate text-gray-600 flex-1">{file.name}</span>
                        <span className="text-gray-400 ml-2 mr-2">{(file.size / 1024).toFixed(1)} KB</span>
                        <button type="button" onClick={() => removeOrangeFile(idx)} className="text-red-400 hover:text-red-600 transition-colors">
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        <button 
          type="submit" disabled={isSubmitting}
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

    let csvContent = "\uFEFF학번,이름,제출일시,데이터이름/출처,분석목적,결론\n";

    submissions.forEach(sub => {
      const date = formatDate(sub.timestamp);
      const td = sub.textData || {};
      const safe = (text) => text ? `"${text.replace(/"/g, '""').replace(/\n/g, ' ')}"` : "";
      csvContent += `${sub.studentId},${sub.studentName},${date},${safe(td.dataNameOrigin)},${safe(td.analysisPurpose)},${safe(td.conclusion)}\n`;
    });

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
                  <th className="p-4 font-semibold">제출일시</th>
                  <th className="p-4 font-semibold">첨부</th>
                  <th className="p-4 font-semibold text-center">상세보기</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800">{sub.studentId}</td>
                    <td className="p-4">{sub.studentName}</td>
                    <td className="p-4 text-gray-500 text-sm">
                      <span className="flex items-center gap-1"><Clock size={14} /> {formatDate(sub.timestamp)}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {sub.images?.length > 0 && <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs">사진 {sub.images.length}</span>}
                        {(sub.dataFiles?.length > 0 || sub.orangeFiles?.length > 0) && <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs">파일 {(sub.dataFiles?.length || 0) + (sub.orangeFiles?.length || 0)}</span>}
                      </div>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex justify-between items-center z-10">
              <h3 className="text-lg font-bold text-gray-800">
                {selectedSub.studentId} {selectedSub.studentName}의 과제
              </h3>
              <button onClick={() => setSelectedSub(null)} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={24} className="text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-8">
              {/* 작성 내용 */}
              {selectedSub.textData && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">Ⅰ. 데이터 이해 및 분석 설계</h4>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4 text-sm text-gray-800">
                      <div><span className="font-semibold">1. 데이터 이름/출처:</span> <p className="whitespace-pre-wrap mt-1">{selectedSub.textData.dataNameOrigin}</p></div>
                      <div><span className="font-semibold">2. 데이터 내용:</span> <p className="whitespace-pre-wrap mt-1">{selectedSub.textData.dataDescription}</p></div>
                      <div><span className="font-semibold">3. 분석 질문:</span> <p className="whitespace-pre-wrap mt-1">{selectedSub.textData.analysisQuestion}</p></div>
                      <div><span className="font-semibold">4. 분석 목적:</span> <p className="whitespace-pre-wrap mt-1">{selectedSub.textData.analysisPurpose}</p></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><span className="font-semibold">5. 분석 방법:</span> <p className="whitespace-pre-wrap mt-1">{selectedSub.textData.analysisMethod}</p></div>
                        <div><span className="font-semibold">6. 선택 이유:</span> <p className="whitespace-pre-wrap mt-1">{selectedSub.textData.analysisReason}</p></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">Ⅱ. 데이터 분석 및 시각화</h4>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4 text-sm text-gray-800">
                      <div><span className="font-semibold">7. 기초 통계값:</span> <p className="whitespace-pre-wrap mt-1">{selectedSub.textData.basicStats}</p></div>
                      <div><span className="font-semibold">8. 데이터 특징:</span> <p className="whitespace-pre-wrap mt-1">{selectedSub.textData.dataFeatures}</p></div>
                      <div className="grid grid-cols-2 gap-4">
                        <div><span className="font-semibold">9. 시각화 그래프:</span> <p className="whitespace-pre-wrap mt-1">{selectedSub.textData.visualizationGraph}</p></div>
                        <div><span className="font-semibold">10. 그래프 해석:</span> <p className="whitespace-pre-wrap mt-1">{selectedSub.textData.graphInterpretation}</p></div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-2">Ⅲ. 결론</h4>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm text-gray-800">
                      <div><span className="font-semibold">11. 최종 결론:</span> <p className="whitespace-pre-wrap mt-1">{selectedSub.textData.conclusion}</p></div>
                    </div>
                  </div>
                </div>
              )}

              {/* 이미지 갤러리 */}
              {selectedSub.images && selectedSub.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">캡처 이미지</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {selectedSub.images.map((img, idx) => {
                      const src = typeof img === 'string' ? img : img?.url;
                      if (!src) return null;
                      return (
                        <img key={idx} src={src} alt={`학생 제출물 ${idx}`} className="w-full rounded-lg border border-gray-200 shadow-sm" />
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 첨부 파일 목록 */}
              {(selectedSub.dataFiles?.length > 0 || selectedSub.orangeFiles?.length > 0) && (
                <div>
                  <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">첨부 파일</h4>
                  <div className="space-y-2">
                    {selectedSub.dataFiles?.map((file, idx) => (
                      <div key={`df-${idx}`} className="flex items-center gap-2 bg-green-50 p-2 rounded-lg border border-green-200">
                        <FileText size={16} className="text-green-600 flex-shrink-0" />
                        {file.url ? (
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-green-800 truncate hover:underline min-w-0"
                          >
                            {file.name}
                          </a>
                        ) : (
                          <span className="text-sm font-medium text-gray-700 truncate min-w-0">{file.name}</span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                    {selectedSub.orangeFiles?.map((file, idx) => (
                      <div key={`of-${idx}`} className="flex items-center gap-2 bg-orange-50 p-2 rounded-lg border border-orange-200">
                        <FileBox size={16} className="text-orange-600 flex-shrink-0" />
                        {file.url ? (
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-orange-800 truncate hover:underline min-w-0"
                          >
                            {file.name}
                          </a>
                        ) : (
                          <span className="text-sm font-medium text-gray-700 truncate min-w-0">{file.name}</span>
                        )}
                        <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}