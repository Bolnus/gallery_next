"use client";
import React from "react";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "../../../../app/navigation";

type UseSearchParams = [ReadonlyURLSearchParams | null, React.Dispatch<React.SetStateAction<ReadonlyURLSearchParams>>];

export function useRouterSearchParams(delay: number = 0): UseSearchParams {
  const searchParams = useSearchParams();
  const [debouncedValue, setDebouncedValue] = React.useState(searchParams);
  const pathname = usePathname();
  const router = useRouter();

  React.useEffect(() => {
    const timeout = setTimeout(() => router.push(`${pathname}?${debouncedValue.toString()}`), delay);
    return () => clearTimeout(timeout);
  }, [debouncedValue, delay, pathname, router]);

  return [searchParams, setDebouncedValue];
}
