const MSG = '학번은 숫자 5자리로 다시 입력해 주세요.';

/** 공백 제거 후 숫자 정확히 5자리만 허용 */
export function parseFiveDigitStudentId(raw) {
  const id = String(raw ?? '').trim();
  if (!/^\d{5}$/.test(id)) {
    return { ok: false, message: MSG };
  }
  return { ok: true, id };
}

/** 학번(5자리)·이름·반 필수 */
export function validateSubmissionIdentity(studentId, studentName, studentClass) {
  const idCheck = parseFiveDigitStudentId(studentId);
  if (!idCheck.ok) return idCheck;

  const name = String(studentName ?? '').trim();
  if (!name) {
    return { ok: false, message: '이름을 입력해 주세요.' };
  }

  const cls = String(studentClass ?? '').trim();
  if (!cls) {
    return { ok: false, message: '반을 선택해 주세요.' };
  }

  return { ok: true, id: idCheck.id, name, studentClass: cls };
}
