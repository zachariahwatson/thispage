export interface IntervalType {
	id: number
	isCompleted: boolean
	isCurrent: boolean
	createdAt: string
	member: {
		profile: {
			id: number
			name: string
			firstName: string
			lastName: string
			avatarUrl: string
		}
	}
}

export interface UnstructuredIntervalType {
	id: number
	is_completed: boolean
	is_current: boolean
	created_at: string
	members: {
		profiles: {
			id: number
			name: string
			first_name: string
			last_name: string
			avatar_url: string
		}
	}
}
