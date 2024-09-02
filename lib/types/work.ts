export type Work = {
	title: string
	key: string
	authors: Author2[]
	type: Type
	description: string
	covers: number[]
	subject_places: string[]
	subjects: string[]
	subject_people: string[]
	subject_times: string[]
	location: string
	latest_revision: number
	revision: number
	created: Created
	last_modified: Created
}

type Created = {
	type: string
	value: string
}

type Author2 = {
	author: Author
	type: Type
}

type Author = {
	key: string
}

type Type = {
	key: string
}
