//get the user's clubs
import { createClient } from "@/utils/supabase/server"
import { ClubType, UnstructuredClubType } from "@/utils/types"

interface MembershipClub {
	id: number
	club_id: number
}

export async function GET() {
	try {
		const supabase = createClient()

		//get the user's club ids as well as membership ids to filter query
		const membershipClubIds: MembershipClub[] = (await getUserMembershipClubIds()) || []
		const clubIds = membershipClubIds?.map((item) => item.club_id) || []
		const membershipIds = membershipClubIds?.map((item) => item.id) || []

		//query
		const { data, error } = await supabase
			.from("clubs")
			.select(
				`id, 
			name, 
			description, 
			members!members_club_id_fkey(
				favorite, 
				reading_tab_index, 
				member_roles!member_roles_member_id_fkey(
					role
				)
			)`
			)
			.in("id", clubIds)
			.in("members.id", membershipIds)

		if (error) {
			console.error("error getting user clubs: " + error.message + ". " + error.hint)
			throw new Error(error.message)
		}

		//structure data for better mutability
		const structuredData: ClubType[] =
			//have to do some weird typecasting here
			(data as any)?.map((club: UnstructuredClubType) => {
				return {
					id: club.id,
					name: club.name,
					description: club.description,
					favorite: club.members[0].favorite,
					readingTabIndex: club.members[0].reading_tab_index,
					role: club.members[0].member_roles.role,
				}
			}) || []

		return Response.json(structuredData, { status: 200 })
	} catch (error) {
		return Response.json({ error: "an error occurred while fetching clubs" }, { status: 500 })
	}
}

//helper function
async function getUserMembershipClubIds() {
	const supabase = createClient()

	const profileId = await getUserProfileId()

	const { data, error } = await supabase.from("members").select("id, club_id").eq("user_profile_id", profileId)

	if (error) {
		console.error("error getting user membership ids: " + error.message + ". " + error.hint)
	}

	return data
}

//helper function
async function getUserProfileId() {
	const supabase = createClient()

	const {
		data: { user },
	} = await supabase.auth.getUser()

	const { data, error } = await supabase.from("profiles").select("id").eq("user_id", user?.id).limit(1).single()

	if (error) {
		console.error("error getting user profile: " + error.message + ". " + error.hint)
	}

	return data?.id
}
