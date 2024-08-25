import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"
import probe from "probe-image-size"

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
		if (body.book_cover_image_url) {
			const image = await probe(body.book_cover_image_url)
			//query
			const { error } = await supabase
				.from("readings")
				.update({
					editor_member_id: body.editor_member_id,
					interval_page_length: body.interval_page_length,
					interval_section_length: body.interval_section_length,
					book_sections: body.book_sections,
					section_name: body.section_name,
					join_in_progress: body.join_in_progress,
					is_archived: body.is_archived || false,
					book_cover_image_url: body.book_cover_image_url,
					book_cover_image_width: image.width,
					book_cover_image_height: image.height,
				})
				.eq("club_id", params.clubId)
				.eq("id", params.readingId)

			if (error) {
				throw error
			}
		} else {
			//query
			const { error } = await supabase
				.from("readings")
				.update({
					editor_member_id: body.editor_member_id,
					interval_page_length: body.interval_page_length,
					interval_section_length: body.interval_section_length,
					book_sections: body.book_sections,
					section_name: body.section_name,
					join_in_progress: body.join_in_progress,
					is_archived: body.is_archived || false,
				})
				.eq("club_id", params.clubId)
				.eq("id", params.readingId)

			if (error) {
				throw error
			}
		}

		return Response.json({ message: "successfully updated reading" }, { status: 200 })
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while updating the reading:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		console.log(error)
		return Response.json({ error: "an error occurred while updating the reading." }, { status: 500 })
	}
}
