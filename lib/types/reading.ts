import type { Interval } from "@/lib/types/interval"

export type Reading = {
	id: number
	club_id: number
	join_in_progress: boolean
	is_finished: boolean
	is_archived: boolean
	interval_page_length: number
	interval_section_length: number
	start_date: string
	book_title: string
	book_description: string | null
	book_authors: string[] | null
	book_page_count: number
	book_cover_image_url: string | null
	book_cover_image_width: number | null
	book_cover_image_height: number | null
	book_sections: number | null
	section_name: string | null
	increment_type: string
	interval: Interval
} | null
