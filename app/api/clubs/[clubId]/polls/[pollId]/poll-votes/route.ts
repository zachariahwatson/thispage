import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * inserts pole votes.
 */
export async function POST(request: NextRequest, { params }: { params: { clubId: string; pollId: string } }) {
	try {
		const supabase = createClient()

		const body = await request.json()

		const { error } = await supabase.from("poll_votes").insert(body)

		if (error) {
			throw error
		}

		return Response.json({ message: "poll voted!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", error)
		switch (error.code) {
			case "23505":
				return Response.json(
					{
						message: "you're not trying to vote twice, are you? refresh the page if the issue persists.",
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

/**
 * deletes pole votes.
 */
export async function DELETE(request: NextRequest, { params }: { params: { clubId: string; pollId: string } }) {
	try {
		const supabase = createClient()

		const body = await request.json()

		const { error } = await supabase
			.from("poll_votes")
			.delete()
			.eq("member_id", body.member_id)
			.in("poll_item_id", body.poll_item_ids)

		if (error) {
			throw error
		}

		return Response.json({ message: "poll votes canceled!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", error)
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
						message: "an error occurred while canceling the poll votes :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
