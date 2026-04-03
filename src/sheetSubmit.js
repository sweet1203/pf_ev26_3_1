const DEFAULT_GOOGLE_SHEET_WEBHOOK =
  'https://script.google.com/macros/s/AKfycbz6AkbByJ7sGh4qScx-27YzvAxwpP48djzx5VNIT2hE7v9qxvUBjPNfLdvyF8rZ1kRv/exec';

export async function postToGoogleSheet(payload) {
  const url = (import.meta.env.VITE_GOOGLE_SHEET_WEBHOOK_URL || DEFAULT_GOOGLE_SHEET_WEBHOOK).trim();
  if (!url) {
    return {
      ok: false,
      message: '.env에 VITE_GOOGLE_SHEET_WEBHOOK_URL(웹앱 /exec 주소)을 설정하세요.',
    };
  }
  try {
    await fetch(url, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return { ok: true };
  } catch (err) {
    console.error('구글 시트 전송 실패:', err);
    return { ok: false, message: '전송 중 오류가 발생했습니다. 네트워크를 확인하세요.' };
  }
}
