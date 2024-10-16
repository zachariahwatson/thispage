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
                created_at,
				comments(count),
				author:members!posts_author_member_id_fkey (
					...users (
						first_name,
						last_name,
						name,
						avatar_url
					)
				)
				`
			)
			.eq("reading_id", params.readingId)
			.order("created_at", { ascending: false }) //sort posts by newest first

		if (error) {
			throw error
		}

		const transformedData: ReadingPost[] = data.map((post) => ({
			id: post.id,
			title: post.title,
			likes_count: post.likes_count,
			is_spoiler: post.is_spoiler,
			created_at: post.created_at,
			comments_count: post.comments[0].count,
			author: {
				first_name: post.author?.first_name ?? null,
				last_name: post.author?.last_name ?? null,
				name: post.author?.name ?? null,
				avatar_url: post.author?.avatar_url ?? null,
			},
		}))

		return Response.json(transformedData, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while fetching the reading's posts:\n", error)
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
						message: "an error occurred while fetching the reading's posts :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}

/**
 * creates a post in the specified reading.
 */
export async function POST(request: NextRequest) {
	try {
		const supabase = createClient()

		const body = await request.json()

		const { error } = await supabase.from("posts").insert({
			reading_id: body.reading_id,
			author_member_id: body.author_member_id,
			title: body.title,
			content: body.content,
			is_spoiler: body.is_spoiler,
		})

		if (error) {
			throw error
		}
		// revalidatePath("/", "layout")
		return Response.json({ message: "post created!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while creating a post:\n", error)

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
						message: "an error occurred while creating the post :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
