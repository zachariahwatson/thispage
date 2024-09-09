import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { NextRequest } from "next/server"

/**
 * creates a club membership.
 */
export async function POST(request: NextRequest) {
	try {
		const supabase = createClient()

		const {
			data: { user },
		} = await supabase.auth.getUser()

		const body = await request.json()

		if (user) {
			const { error } = await supabase.from("members").insert({
				user_id: user?.id,
				club_id: body.club_id,
				used_club_invite_code: body.used_club_invite_code,
			})

			if (error) {
				throw error
			}
			revalidatePath("/", "layout")
			return Response.json({ message: "club joined!" }, { status: 200 })
		}
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while creating a member:\n", error)

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
						message: "an error occurred while joining the club :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
