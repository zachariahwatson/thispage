export type Reading = {
	id: number
	club_id: number
	is_current: boolean
	is_finished: boolean
	interval_page_length: number
	start_date: string
	book: {
		id: number
		title: string
		description: string | null
		authors: string[] | null
		page_count: number
		cover_image_url: string | null
		cover_image_width: number | null
		cover_image_height: number | null
	} | null
} | null
