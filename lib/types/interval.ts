import type { MemberProgress } from "@/lib/types"

export type Interval = {
	id: number
	goal_page: number | null
	goal_section: number | null
	created_at: string
	member_interval_progresses: MemberProgress[]
	user_progress?: MemberProgress
} | null
