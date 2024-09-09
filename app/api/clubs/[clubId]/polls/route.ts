import { Poll, Reading } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"
import probe from "probe-image-size"

/**
 * gets the specified club's polls along with the polls items and the user's vote if they have one. rls ensures that the authenticated user is a member of the club.
 * @param {searchParam} archived - url query that filters readings based on the is_archived value
 */
export async function GET(request: NextRequest, { params }: { params: { clubId: string } }) {
	try {
		const supabase = createClient()
		const searchParams = request.nextUrl.searchParams
		const archived: boolean = searchParams.get("archived") === "true"
		const memberId: number = Number(searchParams.get("memberId"))

		//query
		const { data, error } = await supabase
			.from("polls")
			.select(
				`id,
                created_at,
                club_id,
                end_date,
				voting_length_days,
                is_locked,
                name,
                description,
                status,
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
					creator_member_id,
					poll_votes (
						id,
						member_id,
						poll_item_id
					)

                )
			`
			)
			.eq("club_id", params.clubId)
			.in("status", archived ? ["archived"] : ["selection", "voting", "finished"])
			.order("id", { ascending: true })
			.order("id", { referencedTable: "poll_items", ascending: true })

		if (error) {
			throw error
		}

		if (data) {
			// Transform data to match the Poll type, handling multiple votes
			const transformedData: Poll[] = data.map((poll) => {
				const userVotes: { poll_item_id: number; vote_id: number }[] = []
				let userHasPollItem = false

				// Process poll items and track votes
				poll.items.forEach((item) => {
					if (item.poll_votes && item.poll_votes.length > 0) {
						if (item.poll_votes.some((vote) => vote.member_id === memberId)) {
							userVotes.push({
								poll_item_id: item.poll_votes[0].poll_item_id,
								vote_id: item.poll_votes[0].id,
							})
						}
					}

					if (item.creator_member_id === memberId) {
						userHasPollItem = true
					}
				})

				return {
					...poll,
					items: poll.items,
					user_votes: userVotes, // List of votes by the user for each poll item
					user_has_poll_item: userHasPollItem,
				}
			})
			return Response.json(transformedData as Poll[], { status: 200 })
		}

		return Response.json({}, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", `\nan error occurred while fetching polls in club ${params.clubId}:\n`, error)
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
						message: "an error occurred while fetching polls :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
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
			voting_length_days: body.voting_length_days,
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
		switch (error.code) {
			case "P0003":
				return Response.json(
					{
						message: "you've exceeded the maximum amount of polls. archive or delete one and try again.",
						code: error.code,
					},
					{ status: 500 }
				)
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
						message: "an error occurred while creating the poll :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
