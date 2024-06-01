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
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while creating a member interval progress:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while creating a member interval progress." }, { status: 500 })
	}
}
