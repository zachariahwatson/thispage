export type ReadingPost = {
	id: number
	title: string
	likes_count: number
	is_spoiler: boolean
	created_at: string
	comments_count: number
	author: {
		first_name: string | null
		last_name: string | null
		name: string | null
		avatar_url: string | null
	} | null
}
