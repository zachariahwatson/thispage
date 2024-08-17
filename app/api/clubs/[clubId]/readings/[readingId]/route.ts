import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * deletes a reading.
 */
export async function DELETE(request: NextRequest, { params }: { params: { clubId: string; readingId: string } }) {
	try {
		const supabase = createClient()

		const { error } = await supabase.from("readings").delete().eq("id", params.readingId)

		if (error) {
			throw error
		}
		// revalidatePath("/", "layout")
		return Response.json({ message: "successfully deleted reading" }, { status: 200 })
	} catch (error) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while deleting a reading:\n", error)

		return Response.json({ error: "an error occurred while deleting a reading." }, { status: 500 })
	}
}

/**
 * updates the specified reading.
 */
export async function PATCH(request: NextRequest, { params }: { params: { clubId: string; readingId: string } }) {
	try {
		const supabase = createClient()

		const body = await request.json()

		//query
		const { error } = await supabase
			.from("readings")
			.update({
				editor_member_id: body.editor_member_id,
				interval_page_length: body.interval_page_length,
				join_in_progress: body.join_in_progress,
			})
			.eq("club_id", params.clubId)
			.eq("id", params.readingId)

		if (error) {
			throw error
		}

		return Response.json({ message: "successfully updated reading" }, { status: 200 })
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while updating the reading:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while updating the reading." }, { status: 500 })
	}
}