export type Interval = {
	id: number
	goal_page: number
	goal_section: number
	created_at: string
	member_interval_progresses: {
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
	}[]
} | null
