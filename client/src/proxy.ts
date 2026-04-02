import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  const defaultLocalePrefix = `/${routing.defaultLocale}`;
  const { pathname } = request.nextUrl;

  if (
    pathname === defaultLocalePrefix ||
    pathname.startsWith(`${defaultLocalePrefix}/`)
  ) {
    const url = request.nextUrl.clone();
    const strippedPathname =
      pathname.slice(defaultLocalePrefix.length) || "/";
    url.pathname = strippedPathname;
    return NextResponse.redirect(url, 308);
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
