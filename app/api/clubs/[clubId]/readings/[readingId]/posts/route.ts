import { createClient } from "@/utils/supabase/server"
import type { ReadingPost } from "@/lib/types"
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
                likes_count,
                is_spoiler,
                created_at`
			)
			.eq("reading_id", params.readingId)

		if (error) {
			throw error
		}

		return Response.json(data as ReadingPost[], { status: 200 })
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while fetching the reading's posts:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while fetching the reading's posts." }, { status: 500 })
	}
}
