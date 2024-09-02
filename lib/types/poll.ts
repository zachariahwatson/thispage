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
	total_votes_count: number
	items: {
		id: number
		created_at: string
		book_title: string
		book_description: string | null
		book_authors: string[] | null
		book_page_count: number
		book_cover_image_url: string | null
		book_cover_image_width: number | null
		book_cover_image_height: number | null
		votes_count: number
		creator_member_id: number | null
		poll_votes: {
			id: number
			poll_item_id: number
		}[]
	}[]
	user_vote_id?: number | null
	user_vote_poll_item_id?: number | null
	user_has_poll_item: boolean
} | null
