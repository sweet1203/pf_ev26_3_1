import React from 'react';
import { Link } from 'react-router-dom';
import RiroschoolSubmitNotice from '../components/RiroschoolSubmitNotice.jsx';
import { ManualChrome, ManualH2, ManualStep, ManualTip, ManualUl } from './ManualChrome.jsx';

export default function ManualGrade2() {
  return (
    <ManualChrome
      grade={2}
      title="Orange 3로 수행평가 하기 (2학년 정보)"
      subtitle="데이터를 불러와 본인에게 맞는 위젯으로 분석·시각화하고, 차트 이미지와 Orange 파일을 저장합니다. 과제 파일 제출은 선생님의 안내를 따르세요. 아래 순서를 천천히 따라 하면 됩니다."
    >
      <section className="rounded-xl border border-gray-200 bg-slate-50 p-5 text-sm leading-relaxed">
        <ManualH2>한눈에 보는 순서</ManualH2>
        <ol className="mt-3 list-decimal pl-5 space-y-1.5">
          <li>CSV 데이터 받기 (이 사이트 데이터셋 안내)</li>
          <li>Orange 3에서 파일 불러오기</li>
          <li>위젯을 연결해 나만의 분석·그래프 화면 만들기</li>
          <li>실행해서 그래프 확인하기</li>
          <li>차트 이미지보내기로 저장(PNG 등)</li>
          <li>Orange 작업 전체 저장(.ows 파일)</li>
          <li>리로스쿨에 .ows·차트 이미지 2개 제출(파일명 규칙 확인)</li>
          <li>제출 페이지에서 글 작성·제출</li>
        </ol>
      </section>

      <ManualH2>준비물</ManualH2>
      <ManualUl
        items={[
          '컴퓨터에 설치된 Orange 3 (최신 버전 권장, 무료)',
          '선생님이 안내한 번호의 CSV 파일(데이터셋 안내 페이지에서 본인 학년용 다운로드)',
          '과제 제출 방법은 선생님의 안내를 따르세요.',
        ]}
      />

      <div className="mb-6">
        <RiroschoolSubmitNotice className="border-teal-300 bg-teal-50/90" />
      </div>

      <ManualStep n={1} title="CSV 데이터 받기">
        <p>
          이 사이트에서 <strong>「데이터셋 안내 · 다운로드」</strong>로 들어가 2학년용 파일을 받습니다. 본인이 사용할
          데이터 번호(1~20번)에 맞는 CSV 하나를 저장해 두세요. 파일 이름은 바꾸지 않는 것이 좋습니다.
        </p>
      </ManualStep>

      <ManualStep n={2} title="Orange 3에서 CSV 열기">
        <p>Orange를 실행합니다. 왼쪽 <strong>위젯 목록</strong>에서 다음을 찾습니다.</p>
        <ManualUl
          items={[
            'Data 범주의 File 위젯을 캔버스(가운데 작업판)로 끌어다 놓습니다.',
            'File 위젯을 더블 클릭(또는 한 번 클릭 후 아래쪽 설정 영역)하여 저장해 둔 CSV를 선택합니다.',
            '인코딩이 UTF-8이면 한글 열 이름이 잘 보입니다. 깨지면 선생님께 문의하세요.',
          ]}
        />
        <ManualTip>
          캔버스가 비어 있으면 왼쪽에서 위젯을 검색창으로 찾을 수도 있습니다. 예: &quot;file&quot; 입력.
        </ManualTip>
      </ManualStep>

      <ManualStep n={3} title="나에게 맞는 위젯으로 연결하기">
        <p>
          수행평가에서는 <strong>똑같은 화면복사가 아니라</strong>, 자신이 고른 데이터와 질문에 맞게 위젯을 골라 연결하는
          것이 중요합니다. 아래는 예시일 뿐이며, 데이터에 따라 다른 위젯을 써도 됩니다.
        </p>
        <ManualUl
          items={[
            'Data 범주의 Data Table: 표가 제대로 읽혔는지 행·열을 확인할 때 유용합니다. File 출력을 Data Table 입력에 연결합니다.',
            'Data 범주의 Column Statistics: 열(변수)별 평균·최솟값·최댓값 등 요약을 볼 때',
            'Visualize 범주의 Bar Plot, Distributions: 막대·분포(히스토그램 등). 원 그래프는 수업에서 다루지 않으므로 수행평가에서도 쓰지 않습니다.',
            'Visualize 범주의 Scatter Plot: 두 변수 관계',
            'Visualize 범주의 Box Plot: 값의 퍼짐·이상치',
          ]}
        />
        <p>
          연결 방법: 한 위젯 오른쪽의 <strong>작은 원(출력)</strong>에서 다른 위젯 왼쪽의 <strong>원(입력)</strong>으로
          선을 드래그합니다. 데이터가 흐르는 방향이 맞는지 확인하세요.
        </p>
      </ManualStep>

      <ManualStep n={4} title="실행하고 그래프 확인하기">
        <ManualUl
          items={[
            '차트 위젯을 더블 클릭해 창을 엽니다.',
            '축에 넣을 열(변수)을 위젯 안에서 선택합니다. 범주형·수치형을 바꿔 가며 보면서 가장 잘 드러나는 그래프를 고릅니다.',
            '제목·범례가 없다면 보고서용으로 무엇을 그린 그래프인지 메모해 두세요.',
          ]}
        />
      </ManualStep>

      <ManualStep n={5} title="차트 이미지보내기(저장)">
        <p>
          최종 제출용으로 남길 <strong>그래프 그림 파일</strong>이 필요합니다. Orange 버전에 따라 버튼 이름이
          조금 다를 수 있으나, 보통 아래 중 하나입니다.
        </p>
        <ManualUl
          items={[
            '그래프 창 상단 또는 하단의 「차트 이미지보내기」「이미지 저장」「Save image」「카메라」 모양 아이콘',
            '그래프 영역을 우클릭했을 때 나오는 저장 메뉴',
          ]}
        />
        <p>
          그래프 창에서 <strong>차트 제목</strong>을 본인의 <strong>분석 주제</strong>에 맞게 먼저 적어 둔 뒤 저장합니다.
          저장 형식은 <strong>PNG 또는 JPG</strong>입니다. 파일 이름 규칙(학번이름_차트제목 등)은 위{' '}
          <strong>리로스쿨 제출 파일</strong> 안내와 같이 맞춥니다.
        </p>
        <ManualTip>이미지가 잘리면 창 크기를 키운 뒤 다시 저장해 보세요.</ManualTip>
      </ManualStep>

      <ManualStep n={6} title="Orange 파일(.ows) 저장하기">
        <p>
          선생님이 요구하는 <strong>작업 전체(위젯 배치·연결 상태)</strong>를 파일로 남깁니다. Orange 메뉴에서{' '}
          <strong>File → Save As…</strong> 를 선택하고, 확장자가 <strong>.ows</strong> 인지 확인한 뒤 저장합니다. 파일
          이름은 위 안내와 같이 <strong>학번이름_수행1.ows</strong> 형태로 맞춥니다.
        </p>
        <ManualUl
          items={[
            '나중에 Orange에서 다시 열었을 때 같은 화면이 복원되어야 합니다.',
            'CSV 원본 파일은 삭제하거나 옮기면 연결이 끊길 수 있으니, 제출 전에 한 번 다시 열어 확인하는 것이 좋습니다.',
          ]}
        />
      </ManualStep>

      <ManualStep n={7} title="과제 파일 제출(리로스쿨)">
        <p>
          <strong>리로스쿨</strong>에는 <strong>차트 이미지 1개</strong>와 <strong>.ows 1개</strong>, 총 2개를 업로드합니다.
          파일 이름·형식은 상단 <strong>리로스쿨 제출 파일</strong> 안내와 선생님의 안내를 따르세요.
        </p>
      </ManualStep>

      <ManualStep n={8} title="제출 페이지 글 작성">
        <p>
          이 사이트의 <strong>2학년 제출</strong> 양식에는 데이터 출처, 수집·설명, 열 이름, 그래프 종류와 선택 이유,
          해석 글 등을 적습니다. Orange에서 만든 내용과 <strong>일치</strong>하게 쓰면 됩니다.
        </p>
      </ManualStep>

      <section className="rounded-xl border border-sky-200 bg-sky-50/90 p-5 text-sm text-slate-900 leading-relaxed mb-6">
        <ManualH2>AI 활용 시 유의사항 (2학년)</ManualH2>
        <p className="mt-3 mb-4">
          생성형 AI는 <strong>보조 튜터</strong>로만 쓰는 것이 안전합니다. 막대·꺾은선·산점도의 차이, 그래프 선택 이유,
          해석 문장을 <strong>다듬는 연습</strong> 정도는 도움을 받을 수 있지만, 문항 전체 답이나 해석을 AI에게 통째로
          맡기면 안 됩니다.
        </p>
        <p className="font-semibold text-sky-900 mb-2">이렇게 활용하면 좋아요</p>
        <ManualUl
          items={[
            '「막대 그래프와 꺾은선 그래프는 언제 쓰나요?」처럼 개념을 예시와 함께 물어보기',
            '「내가 보려는 게 연도별 변화인데 어떤 그래프가 맞을까?」처럼 본인 데이터에 맞게 물어보기',
            '「그래프가 이렇게 나왔는데 해석 문장을 초안만 잡아줄 수 있어? 나는 꼭 내 말로 다시 쓸게」',
          ]}
        />
        <p className="font-semibold text-red-800 mt-5 mb-2">이런 사용은 피하세요</p>
        <ManualUl
          items={[
            '「4번부터 9번까지 답 전부 써줘」처럼 수행평가 문항 통째로 요청하기',
            'Orange 캡처만 넘기고 출처·열 설명·해석까지 전부 AI에게 쓰게 하기',
            'AI 답을 그대로 베껴 제출하기 → 복사·붙여넣기 제한·표절 판정 위험',
          ]}
        />
        <ManualTip>
          <Link to="/practice/2-information/prep" className="font-semibold text-teal-800 underline hover:text-teal-950">
            연습 전 대비 가이드
          </Link>
          에도 AI 활용 예시가 정리되어 있습니다. 평가 전에 함께 읽어 보세요.
        </ManualTip>
      </section>

      <section className="rounded-xl border border-red-100 bg-red-50/80 p-5 text-sm text-red-950 leading-relaxed">
        <ManualH2>자주 하는 실수</ManualH2>
        <ManualUl
          items={[
            'CSV를 열지 않고 빈 위젯만 연결한 채 저장하는 경우',
            '수업에서 다루지 않은 원 그래프만 고르거나, 데이터에 맞지 않는 그래프를 고른 경우',
            '차트만 올리거나 .ows만 올려 리로스쿨에 총 2개가 되지 않는 경우',
            '차트 제목·파일 이름이 분석 주제와 맞지 않게 저장하는 경우',
            '다른 학생 파일 이름 그대로 제출하는 경우 → 반드시 본인 학번·이름이 드러나게',
          ]}
        />
      </section>
    </ManualChrome>
  );
}
