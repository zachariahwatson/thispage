import { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { title: string } }) {
	try {
		if (params.title !== "") {
			const url = new URL(
				`https://openlibrary.org/search.json?q=${params.title}&fields=key,title,author_name&limit=100`
			)
			const response = await fetch(url, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})

			if (!response.ok) {
				const body = await response.json()
				throw new Error(body.error)
			}

			const body = await response.json()

			return Response.json(body, { status: 200 })
		}
	} catch (error) {
		return Response.json({ error: "an error occurred while books." }, { status: 500 })
	}
}
