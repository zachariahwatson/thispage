import { ClubMembership } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * gets the authenticated user's clubs with memberships.
 */
export async function GET() {
	try {
		const supabase = createClient()

		const {
			data: { user },
		} = await supabase.auth.getUser()

		if (user) {
			const { data, error } = await supabase
				.from("members")
				.select(
					`
				id,
				club:clubs!members_club_id_fkey (
					id,
					name,
					description
				),
				is_favorite,
				...member_roles!member_roles_member_id_fkey(
					role
				)
			`
				)
				.eq("user_id", user?.id || "")

			if (error) {
				throw error
			}

			return Response.json(data as ClubMembership[], { status: 200 })
		}

		return Response.json(null, { status: 200 })
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while fetching club memberships:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while fetching club memberships." }, { status: 500 })
	}
}

/**
 * creates a new club.
 */
export async function POST(request: NextRequest) {
	try {
		const supabase = createClient()

		const body = await request.json()

		const { error } = await supabase.from("clubs").insert({
			creator_user_id: body.creator_user_id,
			name: body.name,
			description: body.description,
		})

		if (error) {
			throw error
		}
		// revalidatePath("/", "layout")
		return Response.json({ message: "successfully created club" }, { status: 200 })
	} catch (error) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while creating a club:\n", error)

		return Response.json({ error: "an error occurred while creating a club." }, { status: 500 })
	}
}
