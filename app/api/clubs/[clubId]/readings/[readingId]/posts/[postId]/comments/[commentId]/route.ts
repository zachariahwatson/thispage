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
		return Response.json({ message: "successfully deleted comment" }, { status: 200 })
	} catch (error) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while deleting a comment:\n", error)

		return Response.json({ error: "an error occurred while deleting a comment." }, { status: 500 })
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

		return Response.json({ message: "successfully updated comment" }, { status: 200 })
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while updating a comment:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while updating a comment." }, { status: 500 })
	}
}
