import { NextRequest } from "next/server"
import probe from "probe-image-size"

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams
		if (searchParams.get("url")) {
			const url = new URL(searchParams.get("url") || "")
			const response = await probe(url.toString())

			return Response.json(response, { status: 200 })
		}
	} catch (error) {
		return Response.json({ error: "an error occurred while retrieving image info." }, { status: 500 })
	}
}
