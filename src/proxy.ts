import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { validateAuthServerSide } from "./FSD/shared/api/auth/authServer";
import { isProtectedPath } from "./FSD/shared/lib/common/proxyUtils";
import { routing } from "./app/request";

const intlMiddleware = createIntlMiddleware(routing);

async function checkAuth(request: NextRequest): Promise<NextResponse | null> {
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
      try {
        const cookieString = request.headers.get("cookie") || "";
        const resp = await validateAuthServerSide(cookieString);
        if (resp.data.user) {
          return NextResponse.redirect(new URL("/", request.url));
        }
      } catch {
        return null;
      }
    }
  }

  return null;
}

export async function proxy(request: NextRequest): Promise<NextResponse<unknown>> {
  const authResponse = await checkAuth(request);
  if (authResponse) {
    return authResponse;
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)"
};
