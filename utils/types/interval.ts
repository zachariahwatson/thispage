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
