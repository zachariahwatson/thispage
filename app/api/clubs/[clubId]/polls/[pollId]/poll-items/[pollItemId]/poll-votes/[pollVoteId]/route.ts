import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * deletes a poll vote.
 */
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { clubId: string; pollId: string; pollItemId: string; pollVoteId: string } }
) {
	try {
		const supabase = createClient()

		const { error } = await supabase
			.from("poll_votes")
			.delete()
			.eq("id", params.pollVoteId)
			.eq("poll_item_id", params.pollItemId)

		if (error) {
			throw error
		}

		return Response.json({ message: "poll vote cancelled!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", `\nan error occurred while deleting poll vote ${params.pollVoteId}:\n`, error)
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
						message: "an error occurred while canceling the poll vote :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
