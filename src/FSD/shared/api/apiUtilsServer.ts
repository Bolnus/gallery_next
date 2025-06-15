"use server";
import axios, { AxiosInstance } from "axios";

const proxyPort = process.env.NEXT_PUBLIC_PROXY_PORT ? `:${process.env.NEXT_PUBLIC_PROXY_PORT}` : "";
const baseEndpoint = process.env.NEXT_PUBLIC_ENDPOINT || "";
const proxyUrl = process.env.NEXT_PUBLIC_PROXY_URL || "http://localhost";
const baseURL = `${proxyUrl}${proxyPort}${baseEndpoint}`;
export const axiosClientServer = axios.create({
  baseURL
});
