import { Reading } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * gets the specified club's readings along with the user's interval. rls ensures that the authenticated user is a member of the club.
 * @param {searchParam} archived - url query that filters readings based on the is_archived value
 */
export async function GET(request: NextRequest, { params }: { params: { clubId: string } }) {
	try {
		const supabase = createClient()
		const searchParams = request.nextUrl.searchParams
		const archived: boolean = searchParams.get("archived") === "true"

		//query
		const { data, error } = await supabase
			.from("readings")
			.select(
				`id,
			club_id,
			join_in_progress,
			is_finished,
			interval_page_length,
			start_date,
			book_title,
			book_description,
			book_authors,
			book_page_count,
			book_cover_image_url,
			book_cover_image_width,
			book_cover_image_height
			`
			)
			.eq("club_id", params.clubId)
			.eq("is_archived", archived)
			.order("id", { ascending: true })

		if (error) {
			throw error
		}

		return Response.json(data as Reading[], { status: 200 })
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while fetching club readings:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while fetching club readings." }, { status: 500 })
	}
}

/**
 * creates a new reading.
 */
export async function POST(request: NextRequest) {
	try {
		const supabase = createClient()

		const body = await request.json()

		const { error } = await supabase.from("readings").insert({
			club_id: body.club_id,
			creator_member_id: body.creator_member_id,
			interval_page_length: body.interval_page_length,
			start_date: body.start_date,
			join_in_progress: body.join_in_progress,
			book_open_library_id: body.book.open_library_id,
			book_title: body.book.title,
			book_description: body.book.description,
			book_authors: body.book.authors,
			book_page_count: body.book.page_count,
			book_cover_image_url: body.book.cover_image_url,
			book_cover_image_width: body.book.cover_image_width,
			book_cover_image_height: body.book.cover_image_height,
		})

		if (error) {
			throw error
		}
		// revalidatePath("/", "layout")
		return Response.json({ message: "successfully created reading" }, { status: 200 })
	} catch (error) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while creating a reading:\n", error)

		return Response.json({ error: "an error occurred while creating a reading." }, { status: 500 })
	}
}
