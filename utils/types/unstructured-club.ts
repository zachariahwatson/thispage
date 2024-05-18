export interface UnstructuredClubType {
	id: number
	name: string
	description: string
	members: {
		favorite: boolean
		reading_tab_index: number
		member_roles: {
			role: string
		}
	}[]
}
