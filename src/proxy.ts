import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { CMS_COOKIE, isValidSession } from "@/lib/cms/session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(CMS_COOKIE)?.value;
  const signedIn = await isValidSession(token);

  if (pathname === "/admin/login") {
    if (signedIn) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!signedIn) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
