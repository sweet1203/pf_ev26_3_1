/**
 * 화면에 보이지 않게 제출 payload에만 붙입니다.
 * 스프레드시트에는 '기기 또는 OS' 한 열에 넣기 위한 한 줄 문자열입니다.
 */

function detectOs(ua) {
  if (!ua) return '';
  if (/CrOS/i.test(ua)) return 'Chrome OS';
  if (/Windows NT 10\.0/i.test(ua)) return 'Windows 10/11';
  if (/Windows NT/i.test(ua)) return 'Windows';
  if (/Mac OS X|Macintosh/i.test(ua)) return 'macOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return '';
}

export function getClientSubmissionMeta() {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return { clientDeviceInfo: '알 수 없음' };
  }

  const ua = navigator.userAgent || '';
  const maxTP = navigator.maxTouchPoints ?? 0;

  const isIPad = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && maxTP > 1);
  const isAndroidTablet = /Android/i.test(ua) && !/Mobile/i.test(ua);
  const isTablet = isIPad || isAndroidTablet || /Tablet|PlayBook|Silk/i.test(ua);

  const isMobile =
    /Mobi|iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua) && !isAndroidTablet;

  let label = '알 수 없음';
  if (isTablet) label = '태블릿(추정)';
  else if (isMobile) label = '모바일(추정)';
  else label = '노트북·PC(추정)';

  const os = detectOs(ua);
  const clientDeviceInfo = os ? `${label} · ${os}` : label;

  return { clientDeviceInfo };
}
