"use client"

import {
	CardContent,
	CardHeader,
	CardTitle,
	Separator,
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui"
import { useClubMembership } from "@/contexts"
import { useReadings } from "@/hooks/state"
import { useState } from "react"
import { AddPollForm, AddReadingForm } from "@/components/ui/forms/create"
import { PageRight } from "@/components/ui/books"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

interface Props {
	userSpreadIndex: number
	setUserSpreadIndex: React.Dispatch<React.SetStateAction<number>>
}

export function DashboardPageRight({ userSpreadIndex, setUserSpreadIndex }: Props) {
	const [addReadingVisible, setAddReadingVisible] = useState(false)
	const [addPollVisible, setAddPollVisible] = useState(false)
	const clubMembership = useClubMembership()
	const { data: readings, isLoading: loading } = useReadings(clubMembership?.club.id || -1, clubMembership?.id || -1)

	return (
		<PageRight userSpreadIndex={userSpreadIndex} id={`club-${clubMembership?.club.id}-dashboard-page-right`}>
			<CardHeader className="px-4 md:px-6 h-full pt-4 md:pt-6">
				<Separator className="mt-8 hidden md:block" />
				<div className="pr-1 h-1/2">
					<CardTitle className="text-md md:text-lg">add a reading</CardTitle>
					<div className="flex justify-center items-center h-full">
						{!loading && readings && readings.length < 4 ? (
							<>
								<Sheet open={addReadingVisible} onOpenChange={setAddReadingVisible}>
									<SheetTrigger>
										<div className="relative scale-75 md:scale-100">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth={1.5}
												stroke="currentColor"
												className="size-28 text-accent"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
												/>
											</svg>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 16 16"
												fill="currentColor"
												className="size-16 text-accent absolute -top-7 right-[calc(50%-5.5rem)]"
											>
												<path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
											</svg>
										</div>
									</SheetTrigger>
									<SheetContent className="sm:max-w-xl max-w-xl w-full space-y-4 overflow-scroll">
										<SheetHeader>
											<SheetTitle>add a reading</SheetTitle>
										</SheetHeader>
										<AddReadingForm setVisible={setAddReadingVisible} setUserSpreadIndex={setUserSpreadIndex} />
									</SheetContent>
								</Sheet>
							</>
						) : (
							<CardContent>
								<div>
									<p className="text-muted-foreground">reading limit reached.</p>
									<p className="text-muted-foreground">archive or delete readings to add more.</p>
								</div>
							</CardContent>
						)}
					</div>
				</div>
				<div className="pr-1 h-1/2">
					<CardTitle className="text-md md:text-lg">add a poll</CardTitle>
					<div className="flex justify-center items-center h-full">
						<Sheet open={addPollVisible} onOpenChange={setAddPollVisible}>
							<SheetTrigger>
								<div className="relative scale-75 md:scale-100">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.5}
										stroke="currentColor"
										className="size-28 text-accent"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
										/>
									</svg>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 16 16"
										fill="currentColor"
										className="size-16 text-accent absolute -top-8 right-[calc(50%-5.5rem)]"
									>
										<path d="M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z" />
									</svg>
								</div>
							</SheetTrigger>
							<SheetContent className="sm:max-w-xl max-w-xl w-full space-y-4 overflow-scroll">
								<SheetHeader>
									<SheetTitle>add a poll</SheetTitle>
								</SheetHeader>
								<AddPollForm setVisible={setAddPollVisible} setUserSpreadIndex={setUserSpreadIndex} />
							</SheetContent>
						</Sheet>
					</div>
				</div>
			</CardHeader>
		</PageRight>
	)
}
