import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * deletes a reading.
 */
export async function DELETE(request: NextRequest, { params }: { params: { clubId: string; readingId: string } }) {
	try {
		const supabase = createClient()

		const { error } = await supabase.from("readings").delete().eq("id", params.readingId)

		if (error) {
			throw error
		}
		// revalidatePath("/", "layout")
		return Response.json({ message: "successfully deleted reading" }, { status: 200 })
	} catch (error) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while deleting a reading:\n", error)

		return Response.json({ error: "an error occurred while deleting a reading." }, { status: 500 })
	}
}
