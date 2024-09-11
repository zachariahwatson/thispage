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
					description,
					creator_user_id
				),
				is_favorite,
				...member_roles!member_roles_member_id_fkey(
					role
				)
			`
				)
				.eq("user_id", user?.id || "")
				.order("is_favorite", { ascending: false })

			if (error) {
				throw error
			}

			return Response.json(data as ClubMembership[], { status: 200 })
		}

		return Response.json(null, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while fetching club memberships:\n", error)
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
						message: "an error occurred while fetching clubs :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
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
		return Response.json({ message: "club created!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while creating a club:\n", error)

		switch (error.code) {
			case "P0003":
				return Response.json(
					{
						message: "you've exceeded the maximum amount of clubs. delete one and try again.",
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
						message: "an error occurred while creating the club :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
