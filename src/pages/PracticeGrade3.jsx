import React from 'react';
import PracticeGradePage from './PracticeGradePage.jsx';
import { PRACTICE_FORM_GRADE3 } from '../practiceFormUrls.js';

const HOW_TO_STEPS = [
  <>
    <strong>3학년용</strong> CSV만 사용하세요. 목록에서 연습할 <strong>데이터 번호(1~20번)</strong>를 정하고{' '}
    <strong>다운로드</strong>로 저장합니다. 다운받은 파일을 바탕화면/빅데이터 폴더로 이동합니다.
  </>,
  <>
    Orange 3로 데이터를 열고 <strong>범주형·수치형 변수</strong>를 구분한 뒤, 분석 목적에 맞는 위젯으로 표·그래프·기초 통계를
    확인합니다. 실제 수행평가에서는 <strong>리로스쿨</strong>에 <strong>학번이름_수행1.ows</strong>와{' '}
    <strong>차트 이미지보내기</strong>로 저장한 <strong>학번이름_차트제목.png</strong>(차트 제목·파일명은 주제에 맞게){' '}
    <strong>총 2개</strong>를 제출합니다. 아래 박스와 <strong>3학년 안내 매뉴얼</strong>을 확인하세요.
  </>,
  <>
    <strong>연습 제출 (Google 폼)</strong>에서 연습 폼을 연 뒤, 데이터 이름·내용 설명·범주형/수치형 예시·분석 목적·
    분석 방법 선택·기초 통계·그래프 종류·해석·결론·한계 등 <strong>답변</strong>을 채워 봅니다.
  </>,
  <>실제 수행평가 사이트는 복사·붙여넣기가 되지 않습니다.</>,
];

export default function PracticeGrade3() {
  return (
    <PracticeGradePage
      grade={3}
      prepGuideTo="/practice/3-bigdata/prep"
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
          연습 폼은 Google 로그인 안내가 나올 수 있습니다. 이 연습은 <strong>공식 성적 제출이 아니며</strong>, 글·파일 최종
          제출은 위 <strong>리로스쿨 제출</strong> 안내와 <strong>선생님의 안내</strong>를 따르세요.
        </>
      }
    />
  );
}
