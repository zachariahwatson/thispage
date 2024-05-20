export interface IntervalType {
	id: number
	isCompleted: boolean
	isCurrent: boolean
	createdAt: string
	member: {
		profile: {
			name: string
			firstName: string
			lastName: string
			avatarUrl: string
		}
	}
}
