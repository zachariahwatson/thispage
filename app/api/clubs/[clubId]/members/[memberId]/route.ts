import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * deletes a member.
 */
export async function DELETE(request: NextRequest, { params }: { params: { clubId: string; memberId: string } }) {
	try {
		const supabase = createClient()

		const { error } = await supabase.from("members").delete().eq("id", params.memberId)

		if (error) {
			throw error
		}
		// revalidatePath("/", "layout")
		return Response.json({ message: "successfully deleted member" }, { status: 200 })
	} catch (error) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while deleting a member:\n", error)

		return Response.json({ error: "an error occurred while deleting a member." }, { status: 500 })
	}
}
