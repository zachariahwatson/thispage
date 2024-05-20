export interface UnstructuredReadingType {
	id: number
	club_id: number
	current_page: number
	is_current: boolean
	is_finished: boolean
	interval_start_date: string
	interval_days: number
	interval_pages: number
	interval_type: string
	books: {
		id: number
		title: string
		authors: string[]
		page_count: number
		image_url: string
		image_width: number
		image_height: number
	}
}
