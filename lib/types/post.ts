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
		book_title: string
		book_description: string | null
		book_authors: string[] | null
		book_page_count: number
		book_cover_image_url: string | null
		book_cover_image_width: number | null
		book_cover_image_height: number | null
		club: {
			id: number
			name: string
		}
	}
}
