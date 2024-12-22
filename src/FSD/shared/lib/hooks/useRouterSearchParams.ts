"use client";
import React from "react";
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from "next/navigation";

type UseSearchParams = [ReadonlyURLSearchParams | null, (newSearchParams: URLSearchParams) => void];

export function useRouterSearchParams(): UseSearchParams {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const setSearchParams = React.useCallback(function(newSearchParams: URLSearchParams) {
    window.history.pushState(null, "", `${pathname}?${newSearchParams.toString()}`);
    // router.push(`${pathname}?${newSearchParams.toString()}`);
  }, [pathname]);

  return [searchParams, setSearchParams];
}
