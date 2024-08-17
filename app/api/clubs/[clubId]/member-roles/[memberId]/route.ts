import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * updates the specified member.
 */
export async function PATCH(request: NextRequest, { params }: { params: { clubId: string; memberId: string } }) {
	try {
		const supabase = createClient()

		const body = await request.json()

		//query
		const { error } = await supabase
			.from("member_roles")
			.update({
				role: body.role,
				editor_member_id: body.editor_member_id,
			})
			.eq("member_id", params.memberId)

		if (error) {
			throw error
		}

		return Response.json({ message: "successfully updated member role" }, { status: 200 })
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while updating the member's role:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while updating the member's role." }, { status: 500 })
	}
}
