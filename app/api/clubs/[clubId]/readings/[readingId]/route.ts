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
		return Response.json({ message: "reading deleted!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while deleting a reading:\n", error)

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
						message: "an error occurred while deleting the reading :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
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

		return Response.json({ message: "reading updated!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while updating the reading:\n", error)
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
						message: "an error occurred while updating the reading :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
