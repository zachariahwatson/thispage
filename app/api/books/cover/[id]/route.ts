import { version } from "@/lib/version"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		if (params.id !== "" && params.id !== "-1") {
			const url = new URL(`https://covers.openlibrary.org/b/id/${params.id}.json`)
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

			return Response.json(body, { status: 200 })
		}
		return Response.json({}, { status: 200 })
	} catch (error) {
		return Response.json({ error: "an error occurred while retrieving book cover info." }, { status: 500 })
	}
}
