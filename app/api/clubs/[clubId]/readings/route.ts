import { createClient } from "@/utils/supabase/server"
import { ReadingType, UnstructuredReadingType } from "@/utils/types"
import { NextRequest } from "next/server"

/**
 * gets the specified club's readings. rls ensures that the authenticated user is a member of the club.
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
			)`
			)
			.eq("club_id", params.clubId)
			.eq("is_current", current)
			.eq("is_finished", finished)

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
					club_id: reading.club_id,
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
				}
			}) || []
		return Response.json(structuredData, { status: 200 })
	} catch (error) {
		return Response.json({ error: "an error occurred while fetching club readings" }, { status: 500 })
	}
}
