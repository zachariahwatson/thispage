import { Reading } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"
import probe from "probe-image-size"

/**
 * gets the specified club's readings along with the user's interval. rls ensures that the authenticated user is a member of the club.
 * @param {searchParam} archived - url query that filters readings based on the is_archived value
 */
export async function GET(request: NextRequest, { params }: { params: { clubId: string } }) {
	try {
		const supabase = createClient()
		const searchParams = request.nextUrl.searchParams
		const archived: boolean = searchParams.get("archived") === "true"
		const memberId: number = Number(searchParams.get("memberId"))
		const {
			data: { user },
		} = await supabase.auth.getUser()

		//query
		const { data, error } = await supabase
			.from("readings")
			.select(
				`id,
			club_id,
			join_in_progress,
			is_finished,
			is_archived,
			interval_page_length,
			interval_section_length,
			start_date,
			book_title,
			book_description,
			book_authors,
			book_page_count,
			book_cover_image_url,
			book_cover_image_width,
			book_cover_image_height,
			book_sections,
			section_name,
			increment_type,
			interval:intervals (
				id,
                goal_page,
				goal_section,
                created_at,
                member_interval_progresses (
					id,
					is_complete,
					member:members (
						id, 
						user_id,
						...users (
							name,
							first_name,
							last_name,
							avatar_url
						)
					)
				)
			)
			`
			)
			.eq("club_id", params.clubId)
			.eq("is_archived", archived)
			.neq("intervals.member_interval_progresses.member.user_id", user?.id)
			.not("intervals.member_interval_progresses.member", "is", null)
			.order("id", { ascending: true })
			.order("id", { referencedTable: "intervals", ascending: false })
			.limit(1, { referencedTable: "intervals" })

		if (error) {
			throw error
		}

		const destructuredData: Reading[] = data.map((reading) => ({
			...reading,
			interval: reading.interval[0], // Take the first (and only) element from the array
		}))

		const readingData = await Promise.all(
			destructuredData.map(async (reading) => {
				//query for user progress
				const { data: userProgress, error: userProgressError } = await supabase
					.from("member_interval_progresses")
					.select(
						`
				id,
                is_complete,
				member:members (
						id, 
						user_id,
						...users (
							name,
							first_name,
							last_name,
							avatar_url
						)
					)
				`
					)
					.eq("interval_id", reading?.interval?.id || -1)
					.eq("member_id", memberId)
					.maybeSingle()

				if (userProgressError) {
					throw error
				}

				if (reading?.interval) {
					reading.interval.user_progress = userProgress
				}

				return reading
			})
		)

		return Response.json(readingData, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while fetching club readings:\n", error)
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
						message: "an error occurred while fetching the club's readings :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}

/**
 * creates a new reading.
 */
export async function POST(request: NextRequest) {
	try {
		const supabase = createClient()

		const body = await request.json()
		const image = await probe(body.book.cover_image_url)

		const { error } = await supabase.from("readings").insert({
			club_id: body.club_id,
			creator_member_id: body.creator_member_id,
			interval_page_length: body.interval_page_length,
			interval_section_length: body.interval_section_length,
			start_date: body.start_date,
			join_in_progress: body.join_in_progress,
			book_open_library_id: body.book.open_library_id,
			book_title: body.book.title,
			book_description: body.book.description,
			book_authors: body.book.authors,
			book_page_count: body.book.page_count,
			book_cover_image_url: body.book.cover_image_url,
			book_cover_image_width: image.width,
			book_cover_image_height: image.height,
			book_sections: body.book_sections,
			section_name: body.section_name,
			increment_type: body.increment_type,
		})

		if (error) {
			throw error
		}
		// revalidatePath("/", "layout")
		return Response.json({ message: "reading created!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while creating a reading:\n", error)

		switch (error.code) {
			case "P0003":
				return Response.json(
					{
						message: "you've exceeded the maximum amount of readings. archive or delete one and try again.",
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
						message: "an error occurred while creating the reading :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
