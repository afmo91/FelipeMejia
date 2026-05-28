import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET });

  if (token) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = { matcher: ["/cv", "/cv/:path*"] };
