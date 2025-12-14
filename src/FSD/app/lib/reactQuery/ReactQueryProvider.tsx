"use client";
import { isAxiosError } from "axios";
import { QueryClient, QueryClientProvider } from "react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    // queries: {
    //   retry: (failureCount, error: any) => {
    //     if (error?.status === 401 || error?.status === 403) {
    //       return false;
    //     }
    //     return failureCount < 3;
    //   }
    // },
    mutations: {
      onError: (error: unknown) => {
        if (isAxiosError(error) && (error.status === 401 || error.status === 403)) {
          const keysToRemove = ["get-user"];
          queryClient.setQueryData(keysToRemove, null);
          queryClient.removeQueries({ queryKey: keysToRemove });
          void queryClient.invalidateQueries({ queryKey: keysToRemove });

          window.location.href = "/login";
        }
      }
    }
  }
});

export function ReactQueryProvider({ children }: Readonly<React.PropsWithChildren>): JSX.Element {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
