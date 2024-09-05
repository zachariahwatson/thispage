import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * inserts a pole vote.
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: { clubId: string; pollId: string; pollItemId: string } }
) {
	try {
		const supabase = createClient()

		const body = await request.json()

		const { error } = await supabase.from("poll_votes").insert({
			member_id: body.member_id,
			poll_item_id: body.poll_item_id,
		})

		if (error) {
			throw error
		}

		return Response.json({ message: "poll voted!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", error)
		switch (error.code) {
			case "P0003":
				return Response.json(
					{
						message:
							"you're not trying to vote for the same item twice, are you? refresh the page if the issue persists.",
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
						message: "an error occurred while voting in the poll :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
