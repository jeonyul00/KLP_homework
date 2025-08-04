import React from 'react';

const DEFAULT_DELAY = 1000;

export const useDebounce = (delay: number = DEFAULT_DELAY) => {
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const debounce = (callback: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback();
      timeoutRef.current = null;
    }, delay);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { debounce };
};
