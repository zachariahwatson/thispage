import { createClient } from "@/utils/supabase/server"
import { PostType, UnstructuredPostType } from "@/utils/types"
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
                likes,
                created_at,
                updated_at,
                members!posts_author_member_id_fkey(
                    profiles(
                        id,
                        name,
                        first_name,
                        last_name,
                        avatar_url
                    )
                ),
                readings(
                    id,
                    books(
                        id,
                        title,
                        authors,
                        image_url,
                        image_width,
                        image_height
                    ),
                    clubs(
                        id,
                        name
                    )
                )`
			)
			.eq("reading_id", params.readingId)
			.eq("id", params.postId)
			.single()

		if (error) {
			console.error("error getting post: " + error.message + ". " + error.hint)
			throw new Error(error.message)
		}

		const post: UnstructuredPostType = data as any

		//structure data for better mutability
		const structuredData: PostType = {
			id: post.id,
			title: post.title,
			content: post.content,
			likes: post.likes,
			createdAt: post.created_at,
			updatedAt: post.updated_at,
			member: {
				profile: {
					id: post.members.profiles.id,
					name: post.members.profiles.name,
					firstName: post.members.profiles.first_name,
					lastName: post.members.profiles.last_name,
					avatarUrl: post.members.profiles.avatar_url,
				},
			},
			reading: {
				id: post.readings.id,
				book: {
					id: post.readings.books.id,
					title: post.readings.books.title,
					authors: post.readings.books.authors,
					imageUrl: post.readings.books.image_url,
					imageWidth: post.readings.books.image_width,
					imageHeight: post.readings.books.image_height,
				},
				club: {
					id: post.readings.clubs.id,
					name: post.readings.clubs.name,
				},
			},
		}
		return Response.json(structuredData, { status: 200 })
	} catch (error) {
		return Response.json({ error: "an error occurred while fetching the post" }, { status: 500 })
	}
}
