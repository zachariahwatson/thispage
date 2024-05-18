import { createClient } from "@/utils/supabase/server"
import { ReadingType, UnstructuredReadingType } from "@/utils/types"

interface Props {
	clubId: number
}

/**
 * gets the specified club's readings. rls ensures that the authenticated user is a member of the club.
 */
export async function GET(request: Request, { params }: { params: { clubId: string } }) {
	try {
		const supabase = createClient()

		//query
		const { data, error } = await supabase
			.from("readings")
			.select(
				`id,
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
