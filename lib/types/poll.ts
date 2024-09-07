export type Poll = {
	id: number
	created_at: string
	club_id: number
	end_date: string | null
	voting_length_days: number
	is_locked: boolean
	name: string
	description: string | null
	status: "selection" | "voting" | "finished" | "archived"
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
		creator_member_id: number | null
		poll_votes: {
			id: number
			member_id: number
			poll_item_id: number
		}[]
	}[]
	user_votes: {
		poll_item_id: number
		vote_id: number
	}[]
	user_has_poll_item: boolean
} | null
