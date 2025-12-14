import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AuthCredentials } from "../../../shared/api/auth/types";

export function postLoginRequest(
  login: string,
  password: string,
  postAuth: (cred: AuthCredentials) => void,
  localEvent: React.FormEvent<HTMLFormElement>
): void {
  localEvent.preventDefault();
  postAuth({ login, password });
}

export function onLoginSuccess(loggedUser: string, setUser: (str: string) => void, router: AppRouterInstance): void {
  setUser(loggedUser);
  router.push("/");
}
