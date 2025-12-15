"use client";
import { MutationCache, QueryClient, QueryClientProvider } from "react-query";
import { isAxiosError } from "../../../shared/api/galleryApi";

function globalRedirect() {
  window.location.href = "/auth";
}

const mutationCache = new MutationCache({
  onError: (error: unknown) => {
    if (
      isAxiosError(error) &&
      (error.status === 401 || error.status === 403) &&
      !(error.request as { responseURL: string }).responseURL.endsWith("/auth/login")
    ) {
      // const keysToRemove = ["get-user"];
      // queryClient.setQueryData(keysToRemove, null);
      // queryClient.removeQueries({ queryKey: keysToRemove });
      // void queryClient.invalidateQueries({ queryKey: keysToRemove });

      setTimeout(globalRedirect, 1500);
    }
  }
});

export const queryClient = new QueryClient({
  mutationCache
});

export function ReactQueryProvider({ children }: Readonly<React.PropsWithChildren>): JSX.Element {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
