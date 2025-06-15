"use server";
import axios, { AxiosInstance } from "axios";
import { getClientProxyUrl } from "./apiUtils";

export const axiosClientServer = axios.create({
  baseURL: getClientProxyUrl()
});
