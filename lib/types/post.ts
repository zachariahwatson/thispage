export type Post = {
	id: number
	title: string
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
	reading: {
		id: number
		book: {
			id: number
			title: string
			description: string | null
			authors: string[] | null
			cover_image_url: string | null
			cover_image_width: number | null
			cover_image_height: number | null
		}
		club: {
			id: number
			name: string
		}
	}
}
