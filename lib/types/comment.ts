export type Comment = {
	id: number
	content: string
	likes_count: number
	created_at: string
	updated_at: string | null
	member: {
		id: string
		name: string | null
		first_name: string | null
		last_name: string | null
		avatar_url: string | null
	} | null
	comments: {
		id: number
		content: string
		likes_count: number
		created_at: string
		updated_at: string | null
		member: {
			id: string
			name: string | null
			first_name: string | null
			last_name: string | null
			avatar_url: string | null
		} | null
		replying_to: {
			id: number
			member: {
				id: string
				name: string | null
				first_name: string | null
				last_name: string | null
				avatar_url: string | null
			} | null
		} | null
	}[]
}
