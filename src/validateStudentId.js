const MSG = '학번은 숫자 5자리로 다시 입력해 주세요.';

/** 공백 제거 후 숫자 정확히 5자리만 허용 */
export function parseFiveDigitStudentId(raw) {
  const id = String(raw ?? '').trim();
  if (!/^\d{5}$/.test(id)) {
    return { ok: false, message: MSG };
  }
  return { ok: true, id };
}
