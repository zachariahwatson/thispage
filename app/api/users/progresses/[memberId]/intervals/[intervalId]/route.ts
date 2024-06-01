import { MemberProgress } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { NextRequest } from "next/server"

/**
 * gets the specified reading's intervals. rls ensures that the authenticated user is a member of the reading.
 */
export async function GET(request: NextRequest, { params }: { params: { memberId: string; intervalId: string } }) {
	try {
		if (params.intervalId === "null") {
			return Response.json(null, { status: 200 })
		}

		const supabase = createClient()

		//query
		const { data, error } = await supabase
			.from("member_interval_progresses")
			.select(
				`
				id,
                is_complete
				`
			)
			.eq("interval_id", params.intervalId)
			.eq("member_id", params.memberId)
			.maybeSingle()

		if (error) {
			throw error
		}

		return Response.json(data as MemberProgress, { status: 200 })
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while fetching the member's interval progress:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while fetching the member's interval progress." }, { status: 500 })
	}
}

/**
 * updates the specified member interval progress.
 */
export async function PATCH(request: NextRequest, { params }: { params: { memberId: string; intervalId: string } }) {
	try {
		if (params.intervalId === "null") {
			return Response.json(null, { status: 200 })
		}

		const supabase = createClient()

		const body = await request.json()

		//query
		const { error } = await supabase
			.from("member_interval_progresses")
			.update({
				is_complete: body.is_complete,
			})
			.eq("interval_id", params.intervalId)
			.eq("member_id", params.memberId)

		if (error) {
			throw error
		}

		revalidatePath("/", "layout")
		return Response.json({ message: "successfully updated member progress" }, { status: 200 })
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while updating the member's interval progress:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while updating the member's interval progress." }, { status: 500 })
	}
}
