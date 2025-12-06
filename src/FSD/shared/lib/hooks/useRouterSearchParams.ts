"use client";
import React from "react";
import { ReadonlyURLSearchParams, usePathname, useSearchParams } from "next/navigation";

type UseSearchParams = [ReadonlyURLSearchParams | null, React.Dispatch<React.SetStateAction<ReadonlyURLSearchParams>>];

export function useRouterSearchParams(delay: number = 0): UseSearchParams {
  const searchParams = useSearchParams();
  const [debouncedValue, setDebouncedValue] = React.useState(searchParams);
  const pathname = usePathname();

  React.useEffect(() => {
    const timeout = setTimeout(
      () => window.history.pushState(null, "", `${pathname}?${debouncedValue.toString()}`),
      delay
    );
    return () => clearTimeout(timeout);
  }, [debouncedValue, delay, pathname]);

  return [searchParams, setDebouncedValue];
}
