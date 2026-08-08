export function useTouchEnabled(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}
