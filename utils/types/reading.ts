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
}
