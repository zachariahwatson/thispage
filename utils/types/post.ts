export interface PostType {
	id: number
	title: string
	content: string
	likes: number
	createdAt: string
	updatedAt: string
	member: {
		profile: {
			id: number
			name: string
			firstName: string
			lastName: string
			avatarUrl: string
		}
	}
	reading: {
		id: number
		book: {
			id: number
			title: string
			authors: string[]
			imageUrl: string
			imageWidth: number
			imageHeight: number
		}
		club: {
			id: number
			name: string
		}
	}
}

export interface UnstructuredPostType {
	id: number
	title: string
	content: string
	likes: number
	created_at: string
	updated_at: string
	members: {
		profiles: {
			id: number
			name: string
			first_name: string
			last_name: string
			avatar_url: string
		}
	}
	readings: {
		id: number
		books: {
			id: number
			title: string
			authors: string[]
			image_url: string
			image_width: number
			image_height: number
		}
		clubs: {
			id: number
			name: string
		}
	}
}
