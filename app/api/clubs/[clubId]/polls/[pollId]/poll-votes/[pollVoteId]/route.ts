import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * deletes a poll.
 */
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { clubId: string; pollId: string; pollVoteId: string } }
) {
	try {
		const supabase = createClient()

		const { error } = await supabase.from("poll_votes").delete().eq("id", params.pollVoteId)

		if (error) {
			throw error
		}

		return Response.json({ message: "poll vote cancelled!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", `\nan error occurred while deleting poll vote ${params.pollId}:\n`, error)
		return Response.json(
			{
				message: "an error occurred while cancelling the poll vote :(",
				code: error.code,
			},
			{ status: 500 }
		)
	}
}
