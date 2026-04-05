import React, { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { AlertCircle, CheckCircle } from 'lucide-react';
import Home from './pages/Home.jsx';
import Grade3Submit from './pages/Grade3Submit.jsx';
import Grade2Submit from './pages/Grade2Submit.jsx';
import DatasetGuide from './pages/DatasetGuide.jsx';
import PracticeGrade2 from './pages/PracticeGrade2.jsx';
import PracticeGrade3 from './pages/PracticeGrade3.jsx';

function Layout() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 font-sans text-gray-800">
      <Outlet context={{ showToast }} />

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

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/datasets" element={<DatasetGuide />} />
        <Route path="/grade3" element={<Grade3Submit />} />
        <Route path="/grade2" element={<Grade2Submit />} />
        {/* 연습용: 홈·데이터셋 안내 등에서 링크하지 않음. URL로만 접속 */}
        <Route path="/practice/2-information" element={<PracticeGrade2 />} />
        <Route path="/practice/3-bigdata" element={<PracticeGrade3 />} />
      </Route>
    </Routes>
  );
}
