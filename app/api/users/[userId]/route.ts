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
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while fetching user:\n", error)
		switch (error.code) {
			case "42501":
				return Response.json(
					{
						message: "you don't have permission to do that :(",
						code: error.code,
					},
					{ status: 500 }
				)
			default:
				return Response.json(
					{
						message: "an error occurred while fetching the user :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
