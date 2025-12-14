import { NextRequest, NextResponse } from "next/server";
import { validateAuthServerSide } from "./FSD/shared/api/auth/authServer";
import { isProtectedPath } from "./FSD/shared/lib/common/proxyUtils";

export async function proxy(request: NextRequest): Promise<NextResponse<unknown>> {
  console.log("isProtectedPath")
  if (isProtectedPath(request.nextUrl.pathname)) {
    const token = request.cookies.get("gallerySessionId")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }

    try {
      const cookieString = request.headers.get("cookie") || "";
      await validateAuthServerSide(cookieString);
    } catch {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
  } else if (request.nextUrl.pathname.startsWith("/auth")) {
    const token = request.cookies.get("gallerySessionId")?.value;
    if (token) {
      let user = "";
      try {
        const cookieString = request.headers.get("cookie") || "";
        const resp = await validateAuthServerSide(cookieString);
        user = resp.data.user;
        if (user) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch {
        return NextResponse.next();
      }
    }
  }

  return NextResponse.next();
}
