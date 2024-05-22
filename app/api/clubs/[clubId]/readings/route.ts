import { createClient } from "@/utils/supabase/server"
import { ReadingType, UnstructuredReadingType } from "@/utils/types"
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
		const membershipIds: number[] = (await getUserMembershipIds())?.map((item) => item.id) || []

		//query
		const { data, error } = await supabase
			.from("readings")
			.select(
				`id,
			club_id,
			current_page,
			is_current,
			is_finished,
			interval_start_date,
			interval_days,
			interval_pages,
			interval_type,
			books(
				id, 
				title, 
				authors, 
				page_count, 
				image_url, 
				image_width, 
				image_height
			),
			intervals(
				id,
				member_id,
				is_completed,
				is_current,
				created_at
			)`
			)
			.eq("club_id", params.clubId)
			.eq("is_current", current)
			.eq("is_finished", finished)
			.in("intervals.member_id", membershipIds)

		if (error) {
			console.error("error getting club reading: " + error.message + ". " + error.hint)
			throw new Error(error.message)
		}

		//structure data for better mutability
		const structuredData: ReadingType[] =
			//have to do some weird typecasting here
			(data as any)?.map((reading: UnstructuredReadingType) => {
				return {
					id: reading.id,
					clubId: reading.club_id,
					currentPage: reading.current_page,
					isCurrent: reading.is_current,
					isFinished: reading.is_finished,
					intervalStartDate: reading.interval_start_date,
					intervalDays: reading.interval_days,
					intervalPages: reading.interval_pages,
					intervalType: reading.interval_type,
					book: {
						id: reading.books.id,
						title: reading.books.title,
						authors: reading.books.authors,
						pageCount: reading.books.page_count,
						imageUrl: reading.books.image_url,
						imageWidth: reading.books.image_width,
						imageHeight: reading.books.image_height,
					},
					intervals: reading.intervals.map((interval) => {
						return {
							id: interval.id,
							isCompleted: interval.is_completed,
							isCurrent: interval.is_current,
							createdAt: interval.created_at,
						}
					}),
				}
			}) || []
		return Response.json(structuredData, { status: 200 })
	} catch (error) {
		console.error("error getting club reading: " + error)
		return Response.json({ error: "an error occurred while fetching club readings" }, { status: 500 })
	}
}

/**
 * gets the authenticated user's club memberships.
 */
async function getUserMembershipIds() {
	const supabase = createClient()

	const profileId = await getUserProfileId()

	const { data, error } = await supabase.from("members").select("id").eq("user_profile_id", profileId)

	if (error) {
		console.error("error getting user membership ids: " + error.message + ". " + error.hint)
	}

	return data
}

/**
 * gets the authenticated user's profile id.
 */
async function getUserProfileId() {
	const supabase = createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	const { data, error } = await supabase.from("profiles").select("id").eq("user_id", user?.id).limit(1).single()

	if (error) {
		console.error("error getting user profile: " + error.message + ". " + error.hint)
	}

	return data?.id
}
