export type InviteCode = {
	id: number
	club_id: number
	expiration_date: string
	code: string
	uses: number
	created_at: string
	creator: {
		name: string | null
		first_name: string | null
		last_name: string | null
		avatar_url: string | null
	} | null
}
