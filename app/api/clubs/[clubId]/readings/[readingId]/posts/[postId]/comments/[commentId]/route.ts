import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

interface Props {
	params: {
		clubId: string
		readingId: string
		postId: string
		commentId: string
	}
}

/**
 * deletes a comment.
 */
export async function DELETE(request: NextRequest, { params }: Props) {
	try {
		const supabase = createClient()

		const { error } = await supabase.from("comments").delete().eq("id", params.commentId).eq("post_id", params.postId)

		if (error) {
			throw error
		}
		// revalidatePath("/", "layout")
		return Response.json({ message: "comment deleted!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while deleting a comment:\n", error)

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
						message: "an error occurred while deleting the comment :(",
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
			.from("comments")
			.update({
				content: body.content,
			})
			.eq("id", params.commentId)
			.eq("post_id", params.postId)

		if (error) {
			throw error
		}

		return Response.json({ message: "comment updated!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while updating a comment:\n", error)

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
						message: "an error occurred while updating the comment :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
