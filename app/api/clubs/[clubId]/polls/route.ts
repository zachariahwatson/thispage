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
				total_votes_count,
                items:poll_items (
                    id,
                    created_at,
                    book_title,
                    book_description,
                    book_authors,
                    book_cover_image_url,
					book_cover_image_width,
					book_cover_image_height,
					book_page_count,
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
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", `\nan error occurred while fetching polls in club ${params.clubId}:\n`, error)
		return Response.json(
			{
				message: "an error occurred while fetching polls :(",
				code: error.code,
			},
			{ status: 500 }
		)
	}
}

/**
 * creates a new poll.
 */
export async function POST(request: NextRequest, { params }: { params: { clubId: string } }) {
	try {
		const supabase = createClient()

		const body = await request.json()

		const { error } = await supabase.from("polls").insert({
			club_id: body.club_id,
			creator_member_id: body.creator_member_id,
			end_date: body.end_date,
			is_locked: body.is_locked,
			name: body.name,
			description: body.description,
		})

		if (error) {
			throw error
		}
		// revalidatePath("/", "layout")
		return Response.json({ message: "poll created!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", `\nan error occurred while creating a poll in club ${params.clubId}:\n`, error)
		return Response.json(
			{
				message: "an error occurred while creating the poll :(",
				code: error.code,
			},
			{ status: 500 }
		)
	}
}
