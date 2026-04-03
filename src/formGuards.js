const PASTE_MSG = '❌ 모든 텍스트 입력칸은 복사/붙여넣기가 금지되어 있습니다. 직접 타이핑해주세요!';
const DROP_MSG = '❌ 텍스트 드래그 앤 드롭은 금지되어 있습니다.';

/**
 * 데스크톱·모바일 공통: paste 이벤트에서 clipboardData가 비는 경우가 있어
 * 텍스트 여부와 관계없이 항상 막습니다.
 */
export function createTextGuards(showToast) {
  const onPaste = (e) => {
    e.preventDefault();
    if (typeof e.stopPropagation === 'function') e.stopPropagation();
    showToast(PASTE_MSG, 'error');
  };

  const onDrop = (e) => {
    e.preventDefault();
    showToast(DROP_MSG, 'error');
  };

  /** iOS 등에서 paste만으로는 막히지 않을 때 보조 */
  const onBeforeInput = (e) => {
    const type = e.nativeEvent?.inputType;
    if (type === 'insertFromPaste' || type === 'insertFromDrop') {
      e.preventDefault();
      showToast(PASTE_MSG, 'error');
    }
  };

  return { onPaste, onDrop, onBeforeInput };
}
