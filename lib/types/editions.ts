export type Editions = {
	links: Links
	size: number
	entries: Entry[]
}

type Entry = {
	works: Work[]
	title: string
	publishers?: string[]
	publish_date?: string
	key: string
	type: Work
	identifiers?: Identifiers
	covers?: number[]
	isbn_13?: string[]
	classifications?: Classifications
	languages?: Work[]
	translation_of?: string
	translated_from?: Work[]
	description?: Description | string
	physical_format?: string
	first_sentence?: Description
	latest_revision: number
	revision: number
	created: Description
	last_modified: Description
	source_records?: string[]
	authors?: Work[]
	pagination?: string
	full_title?: string
	number_of_pages?: number
	isbn_10?: string[]
	notes?: Description | string
	local_id?: string[]
	weight?: string
	subtitle?: string
	publish_places?: string[]
	edition_name?: string
	copyright_date?: string
	ocaid?: string
	series?: string[]
	oclc_numbers?: string[]
	table_of_contents?: Tableofcontent[]
	lc_classifications?: string[]
	subjects?: string[]
	contributions?: string[]
	work_titles?: string[]
	lccn?: string[]
	publish_country?: string
	by_statement?: string
	physical_dimensions?: string
	other_titles?: string[]
	subject_people?: string[]
}

type Tableofcontent = {
	level: number
	title: string
	type: Work
}

type Description = {
	type: string
	value: string
}

type Classifications = {}

type Identifiers = {
	goodreads?: string[]
	amazon?: string[]
}

type Work = {
	key: string
}

type Links = {
	self: string
	work: string
	next: string
}
