import React from 'react';
import { ManualChrome, ManualH2, ManualStep, ManualTip, ManualUl } from './ManualChrome.jsx';

export default function ManualGrade3() {
  return (
    <ManualChrome
      grade={3}
      title="Orange 3로 수행평가 하기 (3학년 빅데이터분석)"
      subtitle="데이터 이해·기초 통계·시각화·해석까지 Orange 3 위젯으로 정리하고, 차트 이미지와 .ows 파일을 저장합니다. 과제 파일 제출은 선생님 안내를 따르세요. 단계를 순서대로 진행하세요."
    >
      <section className="rounded-xl border border-gray-200 bg-slate-50 p-5 text-sm leading-relaxed">
        <ManualH2>한눈에 보는 순서</ManualH2>
        <ol className="mt-3 list-decimal pl-5 space-y-1.5">
          <li>CSV 데이터 받기 (3학년용)</li>
          <li>Orange에서 불러와 표·통계로 데이터 파악</li>
          <li>분석 목적에 맞는 위젯 연결(그룹 비교, 상관, 분포 등)</li>
          <li>실행 후 표·그래프 확인</li>
          <li>차트 이미지보내기로 저장</li>
          <li>전체 작업 .ows로 저장</li>
          <li>과제 파일 제출(선생님 안내)</li>
          <li>제출 페이지에서 서술형·통계 정리 제출</li>
        </ol>
      </section>

      <ManualH2>준비물</ManualH2>
      <ManualUl
        items={[
          'Orange 3',
          '데이터셋 안내에서 받은 3학년용 CSV(열 구성이 2학년용보다 많을 수 있음)',
          '과제 제출 방법은 선생님 안내',
        ]}
      />

      <ManualStep n={1} title="3학년용 CSV 받기">
        <p>
          <strong>데이터셋 안내 · 다운로드</strong>에서 학년을 <strong>3학년</strong>으로 맞춘 뒤, 본인 데이터 번호의
          파일을 저장합니다. 범주형·수치형 변수가 함께 있는지 미리 열 이름을 읽어 두면 분석 목적을 잡기 쉽습니다.
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
          빅데이터분석 수행평가는 <strong>집단 비교</strong>, <strong>두 변수 관계</strong>, <strong>분포 확인</strong> 등
          목적에 따라 위젯 조합이 달라집니다. 아래는 출발점 예시입니다.
        </p>
        <ManualUl
          items={[
            '그룹별 평균·분포 비교: Visualize 범주의 Box Plot, Bar Plot, Distributions 등. 범주형 열을 “그룹” 축에 두는 연습을 하세요.',
            '두 수치 변수 관계: Visualize의 Scatter Plot. 필요 시 Model 범주의 Linear Regression(선형 회귀) 등(과정에서 배운 범위 내)',
            '기초 통계 수치: Data 범주의 Column Statistics 위젯으로 열(변수)별 평균·분산·최댓값·최솟값 등을 확인합니다. (설치 버전에 따라 표기가 조금 다를 수 있으니 화면에서 같은 이름을 찾으세요.)',
          ]}
        />
        <p>
          <strong>중요:</strong> 친구와 똑같은 연결만 복사하기보다, 본인의 &quot;무엇을 알고 싶은가&quot;에 맞게 위젯과
          변수를 선택합니다.
        </p>
      </ManualStep>

      <ManualStep n={4} title="실행·점검">
        <ManualUl
          items={[
            '각 위젯을 열어 출력이 비어 있지 않은지 확인합니다.',
            '제출용 그래프는 축 레이블·어떤 변수인지 스스로 설명할 수 있어야 합니다.',
          ]}
        />
      </ManualStep>

      <ManualStep n={5} title="차트 이미지보내기(저장)">
        <p>
          제출·보고에 쓸 그래프를 <strong>이미지 파일</strong>로 저장합니다. 시각화 위젯 창에서 저장 아이콘,
          Save image, 또는 우클릭 메뉴를 찾아 <strong>PNG/JPG</strong>로 저장하세요.
        </p>
        <ManualTip>그래프가 여러 개면 대표 그래프와 보조 그래프를 나누어 파일 이름을 정리해 두면 제출 시 헷갈리지 않습니다.</ManualTip>
      </ManualStep>

      <ManualStep n={6} title="Orange 작업 파일(.ows) 저장">
        <p>
          <strong>File → Save As…</strong>로 전체 캔버스를 <strong>.ows</strong>로 저장합니다. 채점·확인용으로 요구될 수
          있으므로, 차트 이미지와 <strong>세트</strong>로 갖추는 것이 안전합니다.
        </p>
      </ManualStep>

      <ManualStep n={7} title="과제 파일 제출">
        <p>
          <strong>이미지 파일</strong>과 <strong>.ows 파일</strong> 제출은 <strong>선생님 안내</strong>를 따르세요.
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
            '상관관계를 인과관계처럼 쓰는 경우 → 제출란「주의점」에 한계를 명시',
          ]}
        />
      </section>
    </ManualChrome>
  );
}
