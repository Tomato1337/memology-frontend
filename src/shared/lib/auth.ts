import { cookies } from "next/headers"
import { redirect } from "next/navigation"

const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1"

/**
 * Server-side auth check for protected routes.
 * Call this at the beginning of protected Server Components.
 *
 * - If access_token exists → returns successfully
 * - If no access_token but refresh_token exists → attempts refresh
 * - If no tokens or refresh fails → redirects to login
 */
export async function requireAuth(redirectPath?: string): Promise<void> {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get("access_token")?.value
	const refreshToken = cookieStore.get("refresh_token")?.value

	// Access token exists - user is authenticated
	if (accessToken) {
		return
	}

	// No access token but refresh token exists - try to refresh
	if (refreshToken) {
		const refreshed = await tryRefreshToken(refreshToken)
		if (refreshed) {
			return
		}
	}

	// No tokens or refresh failed - redirect to login
	const loginUrl = redirectPath
		? `/auth/login?redirect=${encodeURIComponent(redirectPath)}`
		: "/auth/login"
	redirect(loginUrl)
}

async function tryRefreshToken(refreshToken: string): Promise<boolean> {
	try {
		const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Cookie: `refresh_token=${refreshToken}`,
			},
			cache: "no-store",
		})

		return response.ok
	} catch {
		return false
	}
}

/**
 * Check if user is authenticated (for conditional rendering).
 * Does NOT redirect - just returns authentication status.
 */
export async function isAuthenticated(): Promise<boolean> {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get("access_token")?.value
	return !!accessToken
}
