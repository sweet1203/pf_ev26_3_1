import React from 'react';
import PracticeGradePage from './PracticeGradePage.jsx';
import { PRACTICE_FORM_GRADE3 } from '../practiceFormUrls.js';

const HOW_TO_STEPS = [
  <>
    <strong>3학년용</strong> CSV만 사용하세요. 목록에서 연습할 <strong>데이터 번호(1~20번)</strong>를 정하고{' '}
    <strong>다운로드</strong>로 저장합니다. 2학년용 파일과 열 구성이 다를 수 있으니 학년을 헷갈리지 마세요.
  </>,
  <>
    Orange 3 등으로 데이터를 열고, <strong>범주형·수치형 변수</strong>를 구분하고, 분석 목적에 맞는 위젯으로 표·그래프·
    기초 통계를 확인합니다. 실제 제출 시 필요한 <strong>차트 이미지·.ows 파일</strong>은 선생님 안내에 따릅니다.
  </>,
  <>
    <strong>연습 제출 (Google 폼)</strong>에서 연습 폼을 연 뒤, 데이터 이름·내용 설명·범주형/수치형 예시·분석 목적·
    분석 방법 선택·기초 통계·그래프 종류·해석·결론·한계 등 <strong>실제 빅데이터분석 수행평가와 비슷한 항목</strong>을
    채워 봅니다.
  </>,
  <>한 번에 다 적기 어렵다면 메모장에 초안을 쓴 뒤 복사해 넣어도 됩니다.</>,
];

export default function PracticeGrade3() {
  return (
    <PracticeGradePage
      grade={3}
      formUrl={PRACTICE_FORM_GRADE3}
      heroEyebrow="3학년 빅데이터분석 · 연습"
      heroTitle="3학년 빅데이터분석 수행평가(연습용)"
      heroDescription={
        <>
          아래 CSV는 <strong>3학년용</strong>으로 정리한 자료입니다(2학년용과 행·열이 다릅니다).{' '}
          <strong>데이터셋 번호 1~20번</strong>은 파일명 앞 숫자(01~20)와 같습니다. 카드의 설명·출처를 읽고 폼의{' '}
          「선택한 데이터」, 「변수」 란을 채울 때 활용하세요. UTF-8(BOM)이므로 엑셀에서 한글이 깨지면{' '}
          <strong>데이터 → 텍스트/CSV</strong>로 가져오기를 사용하세요.
        </>
      }
      howToTitle="연습 이렇게 진행하세요"
      howToSteps={HOW_TO_STEPS}
      howToNote={
        <>
          연습 폼은 Google 로그인 안내가 나올 수 있습니다. 이 연습은 <strong>공식 성적 제출이 아니며</strong>, 최종
          제출·파일 업로드는 <strong>선생님 안내</strong>를 따르세요.
        </>
      }
    />
  );
}
