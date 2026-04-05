import React from 'react';
import PracticeGradePage from './PracticeGradePage.jsx';
import { PRACTICE_FORM_GRADE2 } from '../practiceFormUrls.js';

export default function PracticeGrade2() {
  return (
    <PracticeGradePage
      grade={2}
      formUrl={PRACTICE_FORM_GRADE2}
      heroEyebrow="2학년 정보 · 연습"
      heroTitle="2학년 정보과 수행평가(연습용)"
      heroDescription={
        <>
          아래 CSV는 수업용으로 정리한 자료입니다. <strong>데이터셋 번호는 1번부터 20번까지 연속</strong>이며 파일명 앞
          숫자(01~20)와 같습니다. 분석 후 &apos;연습 제출 (Google 폼)&apos;에서 답을 제출하세요. UTF-8(BOM)이므로 엑셀에서
          한글이 깨지면 &apos;데이터 → 텍스트/CSV&apos;로 가져오기를 이용하세요.
        </>
      }
    />
  );
}
