import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
	try {
		const url = new URL(`https://openlibrary.org`)
		const response = await fetch(url)

		if (!response.ok) {
			const body = await response.json()
			throw new Error(body.error)
		}

		return new Response(null, { status: 200 })
	} catch (error) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while trying to reach openlibrary.org:\n", error)
		return Response.json({ error: "an error occurred while trying to reach openlibrary.org." }, { status: 500 })
	}
}
