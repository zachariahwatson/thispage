import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * deletes a like.
 */
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { clubId: string; readingId: string; postId: string; commentId: string; likeId: string } }
) {
	try {
		const supabase = createClient()

		const { error } = await supabase.from("likes").delete().eq("id", params.likeId)

		if (error) {
			throw error
		}
		// revalidatePath("/", "layout")
		return Response.json({ message: "like deleted!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while deleting a like:\n", error)

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
						message: "an error occurred while unliking the comment :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
