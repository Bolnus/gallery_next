import { AxiosResponse } from "axios";
import { axiosClientServer } from "../apiUtilsServer";
import { AuthUser } from "./types";

export function validateAuthServerSide(cookieString: string): Promise<AxiosResponse<AuthUser>> {
  return axiosClientServer.get<AuthUser>("/auth/get_user", { headers: { cache: "no-store", Cookie: cookieString } });
}
