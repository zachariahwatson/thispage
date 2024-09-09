import { Work } from "@/lib/types"
import { version } from "@/lib/version"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		if (params.id !== "") {
			const url = new URL(`https://openlibrary.org/works/${params.id}.json`)
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

			return Response.json(body as Work, { status: 200 })
		}
	} catch (error) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while retrieving the book work:\n", error)
		return Response.json({ error: "an error occurred while retrieving the book work." }, { status: 500 })
	}
}
