"use client";
import { QueryClient, QueryClientProvider } from "react-query";

export const queryClient = new QueryClient();

export function ReactQueryProvider({ children }: Readonly<React.PropsWithChildren>): JSX.Element {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
