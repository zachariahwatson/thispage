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
			.single()

		if (error) {
			throw error
		}

		return Response.json(data, { status: 200 })
	} catch (error) {
		console.error(error)
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while fetching club:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while fetching club." }, { status: 500 })
	}
}
