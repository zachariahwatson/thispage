import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"
import type { Comment } from "@/lib/types"

interface Props {
	params: {
		clubId: string
		readingId: string
		postId: string
	}
}

/**
 * gets the specified post's comments. rls ensures that the authenticated user is a member of the reading.
 */
export async function GET(request: NextRequest, { params }: Props) {
	try {
		const supabase = createClient()

		//query (gets comments at the root along with their child comments. right now it works like tiktok where there's only one sublevel where child comments have an anchor link to other child comments)
		const { data, error } = await supabase
			.from("comments")
			.select(
				`
                id,
                content,
                likes_count,
                created_at,
                updated_at,
                member:members(
                    ...users (
						id,
						name,
						first_name,
						last_name,
						avatar_url
					)
                ),
                comments!root_comment_id(
                    id,
                    content,
                    likes_count,
                    created_at,
                    updated_at,
                    member:members(
                        ...users (
							id,
							name,
							first_name,
							last_name,
							avatar_url
						)
                    ),
					replying_to:replying_to_comment_id(
						id,
						member:members(
							...users (
								id,
								name,
								first_name,
								last_name,
								avatar_url
							)
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
			.eq("post_id", params.postId)
			.is("root_comment_id", null)
			.order("likes_count", { ascending: false }) //sort comments by highest likes first

		if (error) {
			throw error
		}

		return Response.json(data as unknown as Comment[], { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while fetching the post's comments:\n", error)
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
						message: "an error occurred while fetching the post's comments :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}

/**
 * creates a comment in the specified post.
 */
export async function POST(request: NextRequest) {
	try {
		const supabase = createClient()

		const body = await request.json()
		// console.log(JSON.stringify(body, null, 4))

		const { error } = await supabase.from("comments").insert({
			post_id: body.post_id,
			author_member_id: body.author_member_id,
			root_comment_id: body.root_comment_id,
			replying_to_comment_id: body.replying_to_comment_id,
			content: body.content,
		})

		if (error) {
			throw error
		}
		// revalidatePath("/", "layout")
		return Response.json({ message: "comment created!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while creating a comment:\n", error)

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
						message: "an error occurred while creating the comment :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
