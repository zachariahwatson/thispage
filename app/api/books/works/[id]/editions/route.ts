import { Editions } from "@/lib/types"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		if (params.id !== "") {
			const url = new URL(`https://openlibrary.org/works/${params.id}/editions.json`)
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

			return Response.json(body as Editions, { status: 200 })
		}
	} catch (error) {
		return Response.json({ error: "an error occurred while retrieving book editions." }, { status: 500 })
	}
}