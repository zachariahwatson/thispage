import { Reading } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"
import probe from "probe-image-size"

/**
 * creates a new poll item.
 */
export async function POST(request: NextRequest, { params }: { params: { clubId: string; pollId: string } }) {
	try {
		const supabase = createClient()

		const body = await request.json()
		const image = await probe(body.book.cover_image_url)

		const { error } = await supabase.from("poll_items").insert({
			poll_id: body.poll_id,
			creator_member_id: body.creator_member_id,
			book_open_library_id: body.book.open_library_id,
			book_title: body.book.title,
			book_description: body.book.description,
			book_authors: body.book.authors,
			book_page_count: body.book.page_count,
			book_cover_image_url: body.book.cover_image_url,
			book_cover_image_width: image.width,
			book_cover_image_height: image.height,
		})

		if (error) {
			throw error
		}
		// revalidatePath("/", "layout")
		return Response.json({ message: "poll item added!" }, { status: 200 })
	} catch (error: any) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			`\nan error occurred while creating a poll item in poll ${params.pollId}:\n`,
			error
		)
		return Response.json(
			{
				message: "an error occurred while adding the poll item :(",
				code: error.code,
			},
			{ status: 500 }
		)
	}
}
