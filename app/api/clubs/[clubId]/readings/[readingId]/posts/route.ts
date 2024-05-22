import { createClient } from "@/utils/supabase/server"
import { IntervalType, ReadingPostType, UnstructuredIntervalType, UnstructuredReadingPostType } from "@/utils/types"
import { NextRequest } from "next/server"

/**
 * gets the specified reading's posts. rls ensures that the authenticated user is a member of the reading.
 */
export async function GET(request: NextRequest, { params }: { params: { clubId: string; readingId: string } }) {
	try {
		const supabase = createClient()

		//query
		const { data, error } = await supabase
			.from("posts")
			.select(
				`id,
                title,
                likes,
                is_spoiler,
                created_at`
			)
			.eq("reading_id", params.readingId)

		if (error) {
			console.error("error getting reading posts: " + error.message + ". " + error.hint)
			throw new Error(error.message)
		}

		//structure data for better mutability
		const structuredData: ReadingPostType[] =
			//have to do some weird typecasting here
			(data as any)?.map((post: UnstructuredReadingPostType) => {
				return {
					id: post.id,
					title: post.title,
					likes: post.likes,
					isSpoiler: post.is_spoiler,
					createdAt: post.created_at,
				}
			}) || []
		return Response.json(structuredData, { status: 200 })
	} catch (error) {
		return Response.json({ error: "an error occurred while fetching reading posts" }, { status: 500 })
	}
}
