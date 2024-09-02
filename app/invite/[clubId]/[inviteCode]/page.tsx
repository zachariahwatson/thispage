import { InvitePage } from "@/components/ui/invite"
import { Database } from "@/lib/types"
import { Metadata } from "next"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

type Club = Database["public"]["Views"]["club_invite_view"]["Row"]

export async function generateMetadata({
	params,
}: {
	params: { clubId: string; inviteCode: string }
}): Promise<Metadata> {
	const fetchClub = async () => {
		const url = new URL(`${defaultUrl}/api/clubs/${params.clubId}/invite`)
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
		if (!response.ok) {
			const body = await response.json()
			throw new Error(body.error)
		}
		return await response.json()
	}
	// fetch data
	const club: Club = await fetchClub()

	return {
		title: `${club.name} invited you! | thispage`,
		description: `join ${club.total_members} ${club.total_members === 1 ? "other" : "others"}`,
		openGraph: {
			title: `${club.name} invited you! | thispage`,
			description: `join ${club.total_members} ${club.total_members === 1 ? "other" : "others"}`,
		},
	}
}

export default function Page({ params }: { params: { clubId: string; inviteCode: string } }) {
	return <InvitePage params={params} />
}
