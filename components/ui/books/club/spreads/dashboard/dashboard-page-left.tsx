"use client"

import { CardHeader, CardTitle, Separator } from "@/components/ui"
import { InviteCodes, MemberList } from "@/components/ui/books/club/spreads/dashboard"
import { CreateInviteButton } from "@/components/ui/buttons"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useClubMembership } from "@/contexts"
import { PageLeft } from "@/components/ui/books"

interface Props {
	userSpreadIndex: number
}

export function DashboardPageLeft({ userSpreadIndex }: Props) {
	const clubMembership = useClubMembership()

	return (
		<PageLeft userSpreadIndex={userSpreadIndex} id={`club-${clubMembership?.club.id}-dashboard-page-left`}>
			<CardHeader className="px-4 md:px-6 h-full pt-4 md:pt-6">
				<CardTitle className="text-md md:text-xl flex flex-row items-center">
					dashboard
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-5 md:size-6 mx-2"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
						/>
					</svg>
				</CardTitle>
				<Separator />

				<div className="space-y-1.5 h-full overflow-scroll pt-2 pr-1">
					<Tabs defaultValue="invites">
						<TabsList>
							<TabsTrigger value="invites">invites</TabsTrigger>
							<TabsTrigger value="members">members</TabsTrigger>
						</TabsList>
						<TabsContent value="invites">
							<div className="flex justify-between pr-1">
								<CardTitle className="text-md md:text-lg">invites</CardTitle>
								{clubMembership?.role === "admin" && <CreateInviteButton />}
							</div>
							<InviteCodes />
						</TabsContent>
						<TabsContent value="members">
							<CardTitle className="text-md md:text-lg">members</CardTitle>
							<MemberList />
						</TabsContent>
					</Tabs>
				</div>
			</CardHeader>
		</PageLeft>
	)
}
