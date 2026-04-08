import React from 'react';
import RiroschoolSubmitNotice from '../components/RiroschoolSubmitNotice.jsx';
import { ManualChrome, ManualH2, ManualStep, ManualTip, ManualUl } from './ManualChrome.jsx';

export default function ManualGrade3() {
  return (
    <ManualChrome
      grade={3}
      title="Orange 3로 수행평가 하기 (3학년 빅데이터분석)"
      subtitle="데이터 이해·기초 통계·시각화·해석까지 Orange 3 위젯으로 정리하고, 차트 이미지와 .ows 파일을 저장합니다. 과제 파일 제출은 선생님의 안내를 따르세요. 단계를 순서대로 진행하세요."
    >
      <section className="rounded-xl border border-gray-200 bg-slate-50 p-5 text-sm leading-relaxed">
        <ManualH2>한눈에 보는 순서</ManualH2>
        <ol className="mt-3 list-decimal pl-5 space-y-1.5">
          <li>CSV 데이터 받기 (3학년용)</li>
          <li>Orange에서 불러와 표·통계로 데이터 파악</li>
          <li>분석 목적에 맞는 위젯 연결(그룹 비교, 상관, 분포 등)</li>
          <li>실행 후 표·그래프 확인</li>
          <li>차트 창 좌측 하단 디스켓 버튼으로 PNG 저장</li>
          <li>전체 작업 .ows로 저장</li>
          <li>리로스쿨에 .ows·차트 이미지 2개 제출(파일명 규칙 확인)</li>
          <li>제출 페이지에서 서술형·통계 정리 제출</li>
        </ol>
      </section>

      <ManualH2>준비물</ManualH2>
      <ManualUl
        items={[
          'Orange 3',
          '수행평가용 데이터셋에서 받은 3학년용 CSV(열 구성이 2학년용보다 많을 수 있음)',
          '과제 제출 방법은 선생님의 안내를 따르세요.',
        ]}
      />

      <div className="mb-6">
        <RiroschoolSubmitNotice grade={3} className="border-orange-300 bg-orange-50/90" />
      </div>

      <ManualStep n={1} title="3학년용 CSV 받기">
        <p>
          <strong>데이터셋 안내</strong>에서 <strong>3학년 수행평가용 데이터셋</strong>을 고르거나,{' '}
          <strong>3학년 수행평가 안내</strong> 화면에서 들어가 3학년 전용 페이지에서 본인 데이터 번호의 파일을 저장합니다.
          범주형·수치형 변수가 함께 있는지 미리 열 이름을 읽어 두면 분석 목적을 잡기 쉽습니다.
        </p>
      </ManualStep>

      <ManualStep n={2} title="Orange에서 데이터 불러오기">
        <ManualUl
          items={[
            '왼쪽 Data 범주의 File 위젯을 캔버스에 놓고 CSV를 지정합니다.',
            'File 출력을 Data 범주의 Data Table 입력에 연결해 행 수, 결측치, 열 타입이 기대와 같은지 봅니다.',
          ]}
        />
        <ManualTip>
          일부 열이 숫자가 아니라 글자로 인식되면 Transform 범주의 Feature Constructor 등으로 다루기 전에 선생님과 상의할 수
          있습니다.
        </ManualTip>
      </ManualStep>

      <ManualStep n={3} title="분석 목적에 맞는 위젯 구성하기">
        <p>
          수행평가에서는 <strong>똑같은 화면복사가 아니라</strong>, 자신이 고른 데이터와 질문에 맞게 위젯을 골라 연결하는
          것이 중요합니다. 빅데이터분석은 <strong>집단 비교</strong>, <strong>두 변수 관계</strong>, <strong>분포 확인</strong> 등
          목적에 따라 위젯 조합이 달라집니다. 아래는 예시일 뿐이며, 데이터에 따라 다른 위젯을 써도 됩니다.
        </p>
        <ManualUl
          items={[
            'Data 범주의 Data Table: 표가 제대로 읽혔는지 행·열을 확인할 때 유용합니다. File 출력을 Data Table 입력에 연결합니다. (앞 단계에서 이미 했다면 이어서 통계·시각화로 넘어가면 됩니다.)',
            'Data 범주의 Column Statistics: 열(변수)별 평균·분산·최솟값·최댓값 등 요약을 볼 때 (설치 버전에 따라 표기가 조금 다를 수 있습니다.)',
            'Visualize 범주의 Bar Plot, Distributions: 막대·분포(히스토그램 등). 본인 데이터와 분석 목적에 맞는 시각화 위젯을 고릅니다.',
            'Visualize 범주의 Scatter Plot: 두 변수 관계',
            'Visualize 범주의 Box Plot: 값의 퍼짐·이상치·그룹 비교. 범주형 열을 그룹 축에 두는 연습을 하세요.',
            '필요 시 Model 범주의 Linear Regression(선형 회귀) 등(과정에서 배운 범위 내)',
          ]}
        />
        <p>
          연결 방법: 한 위젯 오른쪽의 <strong>작은 원(출력)</strong>에서 다른 위젯 왼쪽의 <strong>원(입력)</strong>으로
          선을 드래그합니다. 데이터가 흐르는 방향이 맞는지 확인하세요.
        </p>
        <p>
          <strong>차트(시각화) 위젯</strong>은 수업에서 다룬 범위 안에서, <strong>본인이 세운 분석 질문</strong>에 가장 잘 맞는
          것을 선택합니다. 친구와 똑같은 연결만 복사하지 말고 &quot;무엇을 알고 싶은가&quot;에 맞게 변수와 위젯을 고르세요.
        </p>
      </ManualStep>

      <ManualStep n={4} title="실행·점검">
        <ManualUl
          items={[
            '각 위젯을 열어 출력이 비어 있지 않은지 확인합니다.',
            '분석 목적에 맞는 차트 위젯을 골랐는지 한 번 더 점검합니다.',
            '제출용 그래프는 축 레이블·어떤 변수인지 스스로 설명할 수 있어야 합니다.',
          ]}
        />
      </ManualStep>

      <ManualStep n={5} title="차트 이미지보내기(저장)">
        <p>
          제출·보고에 쓸 그래프를 <strong>이미지 파일</strong>로 남깁니다. 차트(시각화) 위젯을 열었을 때, 창{' '}
          <strong>좌측 하단</strong>에 있는 <strong>디스켓(저장) 모양</strong> 버튼을 누르면 이미지로 저장할 수 있습니다.
        </p>
        <ManualUl
          items={[
            '디스켓 버튼을 누르면 저장 대화상자가 열립니다.',
            '저장할 폴더를 선택한 뒤, 차트 주제에 맞는 파일 이름으로 저장합니다.',
            '파일 이름은 학번이름_차트제목.png 형식으로 맞춥니다. 위 리로스쿨 제출 파일 안내와 선생님의 안내를 따르세요.',
          ]}
        />
        <p>
          그래프 창에서 <strong>차트 제목</strong>을 본인의 <strong>분석 주제</strong>에 맞게 먼저 적어 두면, 파일 이름을
          짓기 쉽습니다.
        </p>
        <ManualTip>
          그래프가 여러 개면 대표 그래프 하나를 제출용으로 정한 뒤 그 창에서 저장하세요. 이미지가 잘리면 창 크기를 키운 뒤
          다시 저장해 보세요.
        </ManualTip>
      </ManualStep>

      <ManualStep n={6} title="Orange 작업 파일(.ows) 저장">
        <p>
          선생님이 요구하는 <strong>작업 전체(위젯 배치·연결)</strong>를 남기려면 Orange 메뉴에서 <strong>File → Save</strong>를
          누른 뒤, 저장 대화상자에서 <strong>바탕화면\빅데이터</strong> 폴더로 들어가 위치를 맞춥니다. 확장자가{' '}
          <strong>.ows</strong>인지 확인하고, 파일 이름은 위 안내와 같이 <strong>학번이름_수행1.ows</strong> 형태로 저장합니다.
          차트 이미지와 <strong>세트</strong>로 갖추는 것이 안전합니다.
        </p>
      </ManualStep>

      <ManualStep n={7} title="과제 파일 제출(리로스쿨)">
        <p>
          <strong>리로스쿨</strong>에는 <strong>차트 이미지 1개</strong>와 <strong>.ows 1개</strong>, 총 2개를 업로드합니다.
          파일 이름·형식은 상단 <strong>리로스쿨 제출 파일</strong> 안내와 선생님의 안내를 따르세요.
        </p>
      </ManualStep>

      <ManualStep n={8} title="웹 제출 양식 작성">
        <p>
          이 사이트 <strong>3학년 제출</strong>에는 데이터 이름·변수 설명·범주형/수치형 예시·분석 목적·선택한 분석 방법·
          기초 통계·그래프 해석·한계 등이 포함됩니다. Orange에서 본 수치·그래프와 <strong>모순 없이</strong> 적습니다.
        </p>
      </ManualStep>

      <section className="rounded-xl border border-red-100 bg-red-50/80 p-5 text-sm text-red-950 leading-relaxed">
        <ManualH2>자주 하는 실수</ManualH2>
        <ManualUl
          items={[
            '2학년용 CSV로 분석해 3학년 제출 양식에 맞지 않는 경우 → 반드시 3학년용 다운로드',
            '통계 값을 대충 적고 Orange 결과와 숫자가 다른 경우 → 위젯에 나온 값을 그대로 옮기기',
            '리로스쿨에 차트·.ows 중 하나만 올리거나, 파일명 규칙(학번이름_수행1.ows 등)을 어기는 경우',
            '상관관계를 인과관계처럼 쓰는 경우 → 제출란「주의점」에 한계를 명시',
            '분석 목적과 맞지 않는 그래프만 고르거나, 친구 화면을 그대로 따라 연결만 한 경우',
          ]}
        />
      </section>
    </ManualChrome>
  );
}
