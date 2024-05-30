export type ClubMembership = {
	id: number
	club: {
		id: number
		name: string
		description: string | null
	}
	is_favorite: boolean
	role: "member" | "moderator" | "admin"
}
