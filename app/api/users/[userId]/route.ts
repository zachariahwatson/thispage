import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * gets the specified user.
 */
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
	try {
		if (params.userId === "null") {
			return Response.json(null, { status: 200 })
		}

		const supabase = createClient()

		//query
		const { data, error } = await supabase.from("users").select("*").eq("id", params.userId).single()

		if (error) {
			throw error
		}

		return Response.json(data, { status: 200 })
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while fetching user:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while fetching user." }, { status: 500 })
	}
}
