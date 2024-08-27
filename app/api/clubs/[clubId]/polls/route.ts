import { Poll, Reading } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"
import probe from "probe-image-size"

/**
 * gets the specified club's polls along with the polls items. rls ensures that the authenticated user is a member of the club.
 * @param {searchParam} archived - url query that filters readings based on the is_archived value
 */
export async function GET(request: NextRequest, { params }: { params: { clubId: string } }) {
	try {
		const supabase = createClient()
		const searchParams = request.nextUrl.searchParams
		const archived: boolean = searchParams.get("archived") === "true"

		//query
		const { data, error } = await supabase
			.from("polls")
			.select(
				`id,
                created_at,
                club_id,
                end_date,
                is_locked,
                name,
                description,
                is_finished,
                is_archived,
                items:poll_items (
                    id,
                    created_at,
                    book_title,
                    book_description,
                    book_authors,
                    book_cover_image_url,
                    votes_count
                )
			`
			)
			.eq("club_id", params.clubId)
			.eq("is_archived", archived)
			.order("id", { ascending: true })

		if (error) {
			throw error
		}

		return Response.json(data as Poll[], { status: 200 })
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while fetching club polls:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while fetching club polls." }, { status: 500 })
	}
}
