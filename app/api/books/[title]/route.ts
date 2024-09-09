import { BookSearch } from "@/lib/types"
import { NextRequest } from "next/server"
import { version } from "@/lib/version"

export async function GET(request: NextRequest, { params }: { params: { title: string } }) {
	try {
		const searchParams = request.nextUrl.searchParams
		if (params.title !== "") {
			const url = new URL(
				`https://openlibrary.org/search.json?q=${params.title}&fields=key,title,author_name,language&limit=5`
			)
			url.searchParams.append("page", searchParams.get("page") ?? "1")
			url.searchParams.append("language", searchParams.get("language") ?? "eng")
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"User-Agent": `thispage/${version} (watsonzachariah@gmail.com)`,
				},
			})

			if (!response.ok) {
				const body = await response.json()
				throw new Error(body.error)
			}

			const body = await response.json()

			return Response.json(body as BookSearch, { status: 200 })
		}
	} catch (error) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while fetching books:\n", error)
		return Response.json({ error: "an error occurred while fetching books." }, { status: 500 })
	}
}
