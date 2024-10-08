import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * deletes a poll.
 */
export async function DELETE(request: NextRequest, { params }: { params: { clubId: string; pollId: string } }) {
	try {
		const supabase = createClient()

		const { error } = await supabase.from("polls").delete().eq("id", params.pollId).eq("club_id", params.clubId)

		if (error) {
			throw error
		}

		return Response.json({ message: "poll deleted!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", `\nan error occurred while deleting poll ${params.pollId}:\n`, error)
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
						message: "an error occurred while deleting the poll :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}

/**
 * updates the specified poll.
 */
export async function PATCH(request: NextRequest, { params }: { params: { clubId: string; pollId: string } }) {
	try {
		const supabase = createClient()

		const body = await request.json()

		const { error } = await supabase
			.from("polls")
			.update({
				editor_member_id: body.editor_member_id,
				is_locked: body.is_locked,
				status: body.status,
				name: body.name,
				description: body.description,
			})
			.eq("id", params.pollId)
			.eq("club_id", params.clubId)

		if (error) {
			throw error
		}

		if (body.status) {
			return Response.json({ message: `poll status changed to ${body.status}!` }, { status: 200 })
		}
		return Response.json({ message: "poll updated!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", `\nan error occurred while updating poll ${params.pollId}:\n`, error)
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
						message: "an error occurred while updating the poll :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
