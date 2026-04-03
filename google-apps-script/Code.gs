/**
 * 수행평가 제출 웹앱 (스프레드시트에 바인딩)
 *
 * 시트1 = 3학년(빅데이터분석) — 웹에서 sheetName "시트1", gradeLevel 3
 * 시트2 = 2학년(정보)       — 웹에서 sheetName "시트2", gradeLevel 2
 *
 * [시트1] 1행 헤더 예시 (열 순서대로, 마지막 열까지 맞추기)
 * 제출일시, 학번, 이름, 반,
 * 데이터명, 데이터내용·변수, 범주·수치변수, 궁금증, 분석목적(한문장),
 * 분석기법, 기법선택이유, 기초통계, 데이터특징(3가지+),
 * 사용그래프, 그래프선택이유, 그래프해석, 최종결론, 해석시주의점,
 * 기기 또는 OS
 *
 * [시트2] 1행 헤더 예시
 * 제출일시, 학번, 이름, 반, 데이터출처, 데이터설명, 데이터항목, 그래프 종류, 그래프이유, 데이터 해석,
 * 기기 또는 OS
 *
 * 배포: 배포 → 새 배포 → 유형「웹 앱」→ 액세스「모든 사용자」
 */

function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      return jsonOut({ result: 'error', message: '본문 없음' });
    }

    var data = JSON.parse(e.postData.contents);
    var td = data.textData || {};
    var dev = data.clientDeviceInfo || '';

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var tab = data.sheetName || (data.gradeLevel === 2 ? '시트2' : '시트1');
    var sheet = ss.getSheetByName(tab);
    if (!sheet) {
      return jsonOut({ result: 'error', message: '시트 없음: ' + tab });
    }

    // ---------- 시트2 · 2학년 ----------
    if (data.gradeLevel === 2 || tab === '시트2') {
      sheet.appendRow([
        data.timestamp || '',
        data.studentId || '',
        data.studentName || '',
        data.studentClass || '',
        td.dataSource || '',
        td.dataDescription || '',
        td.dataColumns || '',
        td.graphType || '',
        td.graphSelectionReason || '',
        td.dataInterpretation || '',
        dev
      ]);
      return jsonOut({ result: 'success' });
    }

    // ---------- 시트1 · 3학년 (구(舊) textData 키 호환) ----------
    var dataName = td.dataName || td.dataNameOrigin || '';
    var dataContent = td.dataContentAndVariables || td.dataDescription || '';
    var catNum = td.categoricalNumericVariables || '';
    var curiosity = td.curiosityQuestion || td.analysisQuestion || '';
    var purposeOne = td.analysisPurposeOneSentence || td.analysisPurpose || '';
    var technique = td.analysisTechniqueLabel || td.analysisTechnique || '';
    var techniqueReason = td.analysisTechniqueReason || td.analysisReason || '';
    var stats = td.basicStats || '';
    var features = td.dataFeaturesThreePlus || td.dataFeatures || '';
    var chart = td.chartUsed || td.visualizationGraph || '';
    var chartWhy = td.chartSelectionReason || '';
    var chartInterp = td.chartInterpretation || '';
    var conclusion = td.finalConclusion || td.conclusion || '';
    var caveats = td.interpretationCaveats || '';

    sheet.appendRow([
      data.timestamp || '',
      data.studentId || '',
      data.studentName || '',
      data.studentClass || '',
      dataName,
      dataContent,
      catNum,
      curiosity,
      purposeOne,
      technique,
      techniqueReason,
      stats,
      features,
      chart,
      chartWhy,
      chartInterp,
      conclusion,
      caveats,
      dev
    ]);

    return jsonOut({ result: 'success' });
  } catch (err) {
    return jsonOut({ result: 'error', message: String(err.message || err) });
  }
}

/** 브라우저에서 URL 열어 동작 확인용 (선택) */
function doGet() {
  return ContentService.createTextOutput('수행평가 제출 웹앱 OK').setMimeType(ContentService.MimeType.TEXT);
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
