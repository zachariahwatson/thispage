export type Poll = {
	id: number
	created_at: string
	club_id: number
	end_date: string
	is_locked: boolean
	name: string
	description: string | null
	is_finished: boolean
	is_archived: boolean
	items: {
		id: number
		created_at: string
		book_title: string
		book_description: string | null
		book_authors: string[] | null
		book_cover_image_url: string | null
		votes_count: number
	}[]
} | null
