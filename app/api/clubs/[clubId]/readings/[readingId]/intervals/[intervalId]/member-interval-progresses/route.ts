import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { NextRequest } from "next/server"

/**
 *
 * @todo check to see if the user already has a member progress
 * @todo fix RLS policy to allow member interval progress creation
 */
export async function POST(request: NextRequest) {
	try {
		const supabase = createClient()

		const body = await request.json()

		const { error } = await supabase.from("member_interval_progresses").insert({
			member_id: body.member_id,
			interval_id: body.interval_id,
		})

		if (error) {
			throw error
		}
		revalidatePath("/", "layout")
		return Response.json({ message: "successfully created member interval progress" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while creating a member interval progress:\n", error)
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
						message: "an error occurred while creating the member's interval progress :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
