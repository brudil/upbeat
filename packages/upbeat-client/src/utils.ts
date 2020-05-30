function debounce(func: () => void, wait: number, immediate: boolean) {
  let timeoutId: number | null = null;
  return (...args: any[]) => {
    const later = function () {
      timeoutId = null;
      if (!immediate) func.apply(this, args);
    };
    const callNow = immediate && !timeoutId;
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    timeoutId = window.setTimeout(later, wait);
    if (callNow) func.apply(this, args);
  };
}
