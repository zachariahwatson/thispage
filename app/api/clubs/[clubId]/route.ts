import { ClubMembership } from "@/lib/types"
import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"

/**
 * gets the specified club info.
 */
export async function GET(request: NextRequest, { params }: { params: { clubId: string } }) {
	try {
		const supabase = createClient()

		const { data, error } = await supabase
			.from("clubs")
			.select(
				`
				name,
                description,
                members!members_club_id_fkey (
                    id, 
                    ...users (
                        name,
                        first_name,
                        last_name,
                        avatar_url
                    )
                )
               
			`
			)
			.eq("id", params.clubId)
			.maybeSingle()

		if (error) {
			throw error
		}

		return Response.json(data, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while fetching a club:\n", error)
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
						message: "an error occurred while fetching the club :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}

/**
 * deletes a club.
 */
export async function DELETE(request: NextRequest, { params }: { params: { clubId: string } }) {
	try {
		const supabase = createClient()

		const { error } = await supabase.from("clubs").delete().eq("id", params.clubId)

		if (error) {
			throw error
		}
		// revalidatePath("/", "layout")
		return Response.json({ message: "club deleted!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while deleting a club:\n", error)

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
						message: "an error occurred while deleting the club :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}

/**
 * updates the specified club.
 */
export async function PATCH(request: NextRequest, { params }: { params: { clubId: string } }) {
	try {
		const supabase = createClient()

		const body = await request.json()

		//query
		const { error } = await supabase
			.from("clubs")
			.update({
				name: body.name,
				description: body.description,
				editor_member_id: body.editor_member_id,
			})
			.eq("id", params.clubId)

		if (error) {
			throw error
		}

		return Response.json({ message: "club updated!" }, { status: 200 })
	} catch (error: any) {
		console.error("\x1b[31m%s\x1b[0m", "\nan error occurred while updating a club:\n", error)
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
						message: "an error occurred while updating the club :(",
						code: error.code,
					},
					{ status: 500 }
				)
		}
	}
}
