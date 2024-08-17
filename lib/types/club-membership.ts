export type ClubMembership = {
	id: number
	club: {
		id: number
		name: string
		description: string | null
		creator_user_id: string
	}
	is_favorite: boolean
	role: "member" | "moderator" | "admin"
}
