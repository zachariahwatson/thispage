import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * creates a like in the specified post.
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: { clubId: string; readingId: string; postId: string } }
) {
	try {
		const supabase = createClient()

		const body = await request.json()

		const { error } = await supabase.from("likes").insert({
			member_id: body.member_id,
			post_id: Number(params.postId),
		})

		if (error) {
			throw error
		}
		// revalidatePath("/", "layout")
		return Response.json({ message: "successfully created like" }, { status: 200 })
	} catch (error) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while creating a like:\n", error)

		return Response.json({ error: "an error occurred while creating a like." }, { status: 500 })
	}
}
