import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const privateRoutes = ["/create", "/gallery"]

const authRoutes = ["/auth/login", "/auth/register"]

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	const token =
		request.cookies.get("access_token")?.value ||
		request.headers.get("Authorization")?.split("Bearer ")[1]

	if (privateRoutes.some((route) => pathname.startsWith(route)) && !token) {
		const url = request.nextUrl.clone()
		url.pathname = "/auth/login"
		url.searchParams.set("redirect", pathname)
		return NextResponse.redirect(url)
	}

	if (authRoutes.some((route) => pathname.startsWith(route)) && token) {
		const url = request.nextUrl.clone()
		url.pathname = "/create"
		return NextResponse.redirect(url)
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
}
