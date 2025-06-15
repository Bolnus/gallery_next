import axios, { AxiosError } from "axios";
import { ApiMessage, ApiResponse } from "./apiTypes";
import { getProxyHostname, getProxyProtocol } from "./apiUtils";

const proxyPort = process.env.NEXT_PUBLIC_PROXY_PORT ? `:${process.env.NEXT_PUBLIC_PROXY_PORT}` : "";
const baseEndpoint = process.env.NEXT_PUBLIC_ENDPOINT || "";
export const baseURL = `${getProxyProtocol()}//${getProxyHostname()}${proxyPort}${baseEndpoint}`;
export const axiosClient = axios.create({
  baseURL
});

export function isAxiosError<T = null>(localError: unknown): localError is AxiosError<T> {
  if (localError?.hasOwnProperty("response")) {
    return true;
  }
  return false;
}

export function isApiError(localError: unknown): localError is AxiosError<ApiMessage> {
  return !!(localError as AxiosError<ApiMessage>)?.response?.data?.message;
}

export function handleResponseError<T = null>(localError: unknown, endPoint: string): ApiResponse<T | null> {
  if (isAxiosError<T>(localError)) {
    console.warn(`Fetch error ${endPoint}: ${localError?.status} ${localError?.code}`);
    if (localError.response?.status === 401) {
      localStorage.removeItem("AccessToken");
      window.location.href = "/auth";
    }
    return {
      rc: localError?.response?.status || 500,
      data: localError?.response?.data || null
    };
  }
  console.warn(`Fetch error ${endPoint}: unknown error`);
  console.log(localError)
  return {
    rc: 500,
    data: null
  };
}
