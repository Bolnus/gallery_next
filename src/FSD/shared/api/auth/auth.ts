import { AxiosResponse } from "axios";
import { axiosClient } from "../galleryApi";
import { AuthCredentials, AuthUser } from "./types";

export function loginMutation(credentials: AuthCredentials): Promise<AxiosResponse<AuthUser>> {
  return axiosClient.post<AuthUser>("/auth/login", credentials);
}

export function validateAuth(): Promise<AxiosResponse<AuthUser>> {
  return axiosClient.get<AuthUser>("/auth/get_user");
}

export function logoutMutation(): Promise<AxiosResponse> {
  return axiosClient.post<AuthUser>("/auth/logout");
}
