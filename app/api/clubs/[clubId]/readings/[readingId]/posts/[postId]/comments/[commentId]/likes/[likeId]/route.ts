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
		return Response.json({ message: "successfully deleted like" }, { status: 200 })
	} catch (error) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while deleting a like:\n", error)

		return Response.json({ error: "an error occurred while deleting a like." }, { status: 500 })
	}
}
