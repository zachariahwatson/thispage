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
 * gets the specified post for metadata purposes.
 */
export async function GET(request: NextRequest, { params }: Props) {
	try {
		const supabase = createClient()

		//query
		const { data, error } = await supabase.from("post_metadata_view").select("*").eq("post_id", params.postId).single()

		if (error) {
			throw error
		}

		return Response.json(data, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while fetching the post's metadata:\n", error)
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
						message: "an error occurred while fetching the post's metadata :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
