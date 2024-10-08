import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * deletes a poll item.
 */
export async function DELETE(
	request: NextRequest,
	{ params }: { params: { clubId: string; pollId: string; pollItemId: string } }
) {
	try {
		const supabase = createClient()

		const { error } = await supabase
			.from("poll_items")
			.delete()
			.eq("id", params.pollItemId)
			.eq("poll_id", params.pollId)

		if (error) {
			throw error
		}

		return Response.json({ message: "poll item deleted!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", `\nan error occurred while deleting poll item ${params.pollItemId}:\n`, error)
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
						message: "an error occurred while deleting the poll item :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
