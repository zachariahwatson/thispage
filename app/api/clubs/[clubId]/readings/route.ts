import { Reading } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * gets the specified club's readings along with the user's interval. rls ensures that the authenticated user is a member of the club.
 * @param {searchParam} current - url query that filters readings based on the is_current value
 * @param {searchParam} finished - url query that filters readings based on the is_finished value
 */
export async function GET(request: NextRequest, { params }: { params: { clubId: string } }) {
	try {
		const supabase = createClient()
		const searchParams = request.nextUrl.searchParams
		const current: boolean = searchParams.get("current") === "true"
		const finished: boolean = searchParams.get("finished") === "true"

		//query
		const { data, error } = await supabase
			.from("readings")
			.select(
				`id,
			club_id,
			is_current,
			is_finished,
			interval_page_length,
			start_date,
			book:books (
				id, 
				title, 
				description,
				authors, 
				page_count, 
				cover_image_url, 
				cover_image_width, 
				cover_image_height
			)
			`
			)
			.eq("club_id", params.clubId)
			.eq("is_current", current)
			.eq("is_finished", finished)

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
