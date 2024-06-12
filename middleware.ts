import { NextRequest, NextResponse } from "next/server"
import { updateSession } from "@/utils/supabase/middleware"

export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
		 * Feel free to modify this pattern to include more paths.
		 */
		"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
		"/api/:path*",
	],
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
	: "http://localhost:3000"

const allowedOrigins = [
	"https://thispage-git-main-zachariahwatsons-projects.vercel.app",
	"https://thispage-zachariahwatsons-projects.vercel.app",
	"https://thispage.vercel.app",
	"https://thispa.ge/",
	"https://www.thispa.ge/",
	defaultUrl,
]

const corsOptions = {
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
}

export async function middleware(request: NextRequest) {
	// Check the origin from the request
	const origin = request.headers.get("origin") ?? ""
	const isAllowedOrigin = allowedOrigins.includes(origin)

	// Handle preflighted requests
	const isPreflight = request.method === "OPTIONS"

	if (isPreflight) {
		const preflightHeaders = {
			...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
			...corsOptions,
		}
		return NextResponse.json({}, { headers: preflightHeaders })
	}

	// Update session
	await updateSession(request)

	// Handle simple requests
	const response = NextResponse.next()

	if (isAllowedOrigin) {
		response.headers.set("Access-Control-Allow-Origin", origin)
	}

	Object.entries(corsOptions).forEach(([key, value]) => {
		response.headers.set(key, value)
	})

	return response
}
