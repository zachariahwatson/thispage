import { createClient } from "@/utils/supabase/server"
import { IntervalType, UnstructuredIntervalType } from "@/utils/types"
import { NextRequest } from "next/server"

/**
 * gets the specified member's intervals. rls ensures that the authenticated user is a member of the reading.
 * @param {searchParam} current - url query that filters intervals based on the is_current value
 * @param {searchParam} completed - url query that filters intervals based on the is_completed value
 */
export async function GET(request: NextRequest, { params }: { params: { memberId: string } }) {
	try {
		const supabase = createClient()
		const searchParams = request.nextUrl.searchParams
		const current: boolean = searchParams.get("current") === "true"
		const completed: boolean = searchParams.get("completed") === "true"

		//query
		const { data, error } = await supabase
			.from("intervals")
			.select(
				`id,
			member_id,
            reading_id,
            is_completed,
            is_current,
            created_at`
			)
			.eq("member_id", params.memberId)
			.eq("is_current", current)
			.eq("is_completed", completed)

		if (error) {
			console.error("error getting reading intervals: " + error.message + ". " + error.hint)
			throw new Error(error.message)
		}

		//structure data for better mutability
		const structuredData: IntervalType[] =
			//have to do some weird typecasting here
			(data as any)?.map((interval: UnstructuredIntervalType) => {
				return {
					id: interval.id,
					isCompleted: interval.is_completed,
					isCurrent: interval.is_current,
					createdAt: interval.created_at,
				}
			}) || []
		return Response.json(structuredData, { status: 200 })
	} catch (error) {
		return Response.json({ error: "an error occurred while fetching reading intervals" }, { status: 500 })
	}
}
