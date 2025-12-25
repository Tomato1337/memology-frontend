import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const authRoutes = ["/auth/login", "/auth/register"]

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl

	const accessToken = request.cookies.get("access_token")?.value

	if (authRoutes.some((route) => pathname.startsWith(route)) && accessToken) {
		const url = request.nextUrl.clone()
		url.pathname = "/"
		return NextResponse.redirect(url)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/auth/:path*"],
}
