import { createClient } from "@/utils/supabase/server"
import type { Post } from "@/lib/types"
import { NextRequest } from "next/server"

interface Props {
	params: {
		clubId: string
		readingId: string
		postId: string
	}
}

/**
 * gets the specified post. rls ensures that the authenticated user is a member of the reading.
 */
export async function GET(request: NextRequest, { params }: Props) {
	try {
		const supabase = createClient()

		//query
		const { data, error } = await supabase
			.from("posts")
			.select(
				`id,
                title,
                content,
                likes_count,
                created_at,
                updated_at,
                member:members!posts_author_member_id_fkey(
                    ...users (
						id,
						name,
						first_name,
						last_name,
						avatar_url
						)
                ),
                reading:readings(
                    id,
                    book:books(
                        id,
                        title,
						description,
                        authors,
                        cover_image_url,
                        cover_image_width,
                        cover_image_height
                    ),
                    club:clubs(
                        id,
                        name
                    )
                )`
			)
			.eq("reading_id", params.readingId)
			.eq("id", params.postId)
			.single()

		if (error) {
			throw error
		}

		return Response.json(data as Post, { status: 200 })
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while fetching the post:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while fetching the post." }, { status: 500 })
	}
}
