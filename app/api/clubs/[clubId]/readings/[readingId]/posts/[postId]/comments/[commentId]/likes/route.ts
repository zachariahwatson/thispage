import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * creates a like in the specified post.
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: { clubId: string; readingId: string; postId: string; commentId: string } }
) {
	try {
		const supabase = createClient()

		const body = await request.json()

		const { error } = await supabase.from("likes").insert({
			member_id: body.member_id,
			comment_id: Number(params.commentId),
		})

		if (error) {
			throw error
		}
		// revalidatePath("/", "layout")
		return Response.json({ message: "like created!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while creating a like:\n", error)

		switch (error.code) {
			case "23505":
				return Response.json(
					{
						message: "you've already liked this comment. refresh if the error persists.",
						code: error.code,
					},
					{ status: 500 }
				)
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
						message: "an error occurred while liking the comment :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
