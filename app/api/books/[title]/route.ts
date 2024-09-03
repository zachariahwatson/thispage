import { BookSearch } from "@/lib/types"
import { NextRequest } from "next/server"

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
					"User-Agent": "thispage/0.9.1 (watsonzachariah@gmail.com)",
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
		return Response.json({ error: "an error occurred while books." }, { status: 500 })
	}
}
