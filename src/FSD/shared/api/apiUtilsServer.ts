"use server";
import axios from "axios";
import { getClientProxyUrl } from "./apiUtils";

export const axiosClientServer = axios.create({
  baseURL: getClientProxyUrl()
});
