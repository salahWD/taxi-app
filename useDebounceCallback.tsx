import { useRef, useCallback } from "react";

export default function useDebounceCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number = 300
): T {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  ) as T;
}
