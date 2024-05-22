export interface ReadingType {
	id: number
	clubId: number
	currentPage: number
	isCurrent: boolean
	isFinished: boolean
	intervalStartDate: string
	intervalDays: number
	intervalPages: number
	intervalType: string
	book: {
		id: number
		title: string
		authors: string[]
		pageCount: number
		imageUrl: string
		imageWidth: number
		imageHeight: number
	}
	intervals: {
		id: number
		isCompleted: boolean
		isCurrent: boolean
		createdAt: string
	}[]
}

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
	intervals: {
		id: number
		is_completed: boolean
		is_current: boolean
		created_at: string
	}[]
}
