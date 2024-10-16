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
				is_spoiler,
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
					book_title,
					book_description,
					book_authors,
					book_cover_image_url,
					book_cover_image_width,
					book_cover_image_height,
                    club:clubs(
                        id,
                        name
                    )
                ),
				likes (
					...members (
						...users (
							first_name,
							last_name,
							name,
							avatar_url
						)
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
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while fetching the post:\n", error)
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
						message: "an error occurred while fetching the post :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}

/**
 * deletes a post.
 */
export async function DELETE(request: NextRequest, { params }: Props) {
	try {
		const supabase = createClient()

		const { error } = await supabase.from("posts").delete().eq("id", params.postId).eq("reading_id", params.readingId)

		if (error) {
			throw error
		}
		// revalidatePath("/", "layout")
		return Response.json({ message: "post deleted!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while deleting a post:\n", error)

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
						message: "an error occurred while deleting the post :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}

/**
 * updates the specified post.
 */
export async function PATCH(request: NextRequest, { params }: Props) {
	try {
		const supabase = createClient()

		const body = await request.json()

		//query
		const { error } = await supabase
			.from("posts")
			.update({
				content: body.content,
				is_spoiler: body.is_spoiler,
				editor_member_id: body.editor_member_id,
			})
			.eq("id", params.postId)
			.eq("reading_id", params.readingId)

		if (error) {
			throw error
		}

		return Response.json({ message: "post updated!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while updating a post:\n", error)
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
						message: "an error occurred while updating the post :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
