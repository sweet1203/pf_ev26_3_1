import React from 'react';
import PracticeGradePage from './PracticeGradePage.jsx';
import { PRACTICE_FORM_GRADE2 } from '../practiceFormUrls.js';

const HOW_TO_STEPS = [
  <>
    목록에서 <strong>수행평가에 쓸 데이터 번호(1~20번)</strong>를 정한 뒤, 해당 행의 <strong>다운로드</strong>로 CSV를
    저장합니다. 다운로드 폴더에서 바탕화면/정보 폴더로 이동하세요.
  </>,
  <>
    Orange 3 등 수업에서 쓰는 도구로 CSV를 열고, <strong>본인에게 맞는 위젯</strong>으로 표를 확인·그래프를 만듭니다.
    차트 이미지 저장, .ows 저장은 <strong>실제 수행평가 때 선생님 안내</strong>에 맞추면 됩니다. 이 연습 페이지에서는
    폼 작성 연습이 중심입니다.
  </>,
  <>
    상단 카드의 <strong>연습 제출 (Google 폼)</strong>을 눌러 연습 폼이 열리면, 안내에 따라 학번·이름·반과 함께{' '}
    <strong>데이터 출처, 수집 내용 설명, 열(항목) 목록, 그래프 종류·선택 이유, 해석 글</strong> 등을 채웁니다. 실제
    제출 양식과 비슷하게 연습할 수 있습니다.
  </>,
  <>제출 후에는 브라우저에 나오는 완료 화면을 확인합니다. 수정이 필요하면 폼 안내에 따릅니다.</>,
  <>실제 수행평가 제출 사이트에서는 복사·붙여넣기가 되지 않습니다.</>,
];

export default function PracticeGrade2() {
  return (
    <PracticeGradePage
      grade={2}
      formUrl={PRACTICE_FORM_GRADE2}
      heroEyebrow="2학년 정보 · 연습"
      heroTitle="2학년 정보과 수행평가(연습용)"
      heroDescription={
        <>
          아래 CSV는 <strong>수행평가용</strong>으로 정리한 자료입니다.{' '}
          <strong>데이터셋 번호는 1번부터 20번까지 연속</strong>이며, 파일명 앞 숫자(01~20)와 같습니다. 각 데이터 설명·
          출처는 카드를 펼쳐 확인한 뒤, 폼에 &quot;데이터 출처&quot;를 적을 때 참고하세요. UTF-8(BOM)이므로 엑셀에서 한글이
          깨지면 <strong>데이터 → 텍스트/CSV</strong>로 가져오기를 사용하세요.
        </>
      }
      howToTitle="연습 이렇게 진행하세요"
      howToSteps={HOW_TO_STEPS}
      howToNote={
        <>
          연습 폼은 <strong>Google 계정으로 로그인</strong>하라는 안내가 나올 수 있습니다. 학교·가정 정책에 맞게
          진행하세요. 이 연습 제출은 <strong>공식 성적 제출이 아닙니다.</strong>
        </>
      }
    />
  );
}
