"use client";
import { ComponentProps, ComponentPropsWithoutRef } from "react";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export function ReactQueryProvider({ children }: React.PropsWithChildren) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}