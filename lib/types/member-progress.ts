export type MemberProgress = {
	id: number
	is_complete: boolean
	member: {
		id: number
		user_id: string
		name: string | null
		first_name: string | null
		last_name: string | null
		avatar_url: string | null
	} | null
} | null
