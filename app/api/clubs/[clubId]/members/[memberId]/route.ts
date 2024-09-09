import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * deletes a member.
 */
export async function DELETE(request: NextRequest, { params }: { params: { clubId: string; memberId: string } }) {
	try {
		const supabase = createClient()

		const { error } = await supabase.from("members").delete().eq("id", params.memberId)

		if (error) {
			throw error
		}
		// revalidatePath("/", "layout")
		return Response.json({ message: "member kicked!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while deleting a member:\n", error)

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
						message: "an error occurred while kicking the member :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
