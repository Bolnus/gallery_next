"use client";
import React from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export function useStateWithDebounced<T>(
  initialState: T | (() => T),
  delay: number
): [T, T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = React.useState<T>(initialState);
  const debounced = useDebounce(value, delay);

  return [value, debounced, setValue];
}
