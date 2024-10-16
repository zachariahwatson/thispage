"use client"

import { ClubBook, ClubBookSkeleton } from "@/components/ui/books/club"
import { Button } from "@/components/ui/buttons"
import { ClubMembershipProvider } from "@/contexts"
import { FirstLoadAnimationProvider } from "@/contexts/first-load-animation"
import { useClubs } from "@/hooks/state"
import { QueryError } from "@/utils/errors"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui"
import { useQuery } from "react-query"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

/**
 * returns a list of book clubs. we can't use suspense here as we need the fetch to be called from the client in order to preserve auth cookies. <Suspense> only works with async components and client components can't be async.
 */
export function ClubBooks() {
	const { data: clubMemberships, isLoading: loading, error, refetch } = useClubs()

	const { isLoading: openLibraryLoading, isError: openLibraryError } = useQuery({
		queryKey: ["openlibrary"],
		queryFn: async () => {
			const response = await fetch(`${defaultUrl}/api/status`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			})

			if (!response.ok) {
				const body = await response.json()
				throw new QueryError(body.error, body.status)
			}

			return await response.json()
		},
		retry: false,
	})

	return (
		<>
			{!openLibraryLoading && openLibraryError && (
				<Alert variant="destructive" className="-mb-6 md:-mb-4 max-w-sm md:max-w-4xl">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={1.5}
						stroke="currentColor"
						className="size-5"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
						/>
					</svg>

					<AlertTitle>we couldn't reach openlibrary.org 🫤</AlertTitle>
					<AlertDescription>
						book cover images and book search functionality will be unavailable until the issue resolves.
					</AlertDescription>
				</Alert>
			)}

			{!error ? (
				!loading ? (
					clubMemberships && clubMemberships.length > 0 ? (
						clubMemberships.map((clubMembership, index) => (
							<FirstLoadAnimationProvider key={index}>
								<ClubMembershipProvider clubMembershipData={clubMembership}>
									<ClubBook />
								</ClubMembershipProvider>
							</FirstLoadAnimationProvider>
						))
					) : (
						<div className="space-y-4 text-center w-full">
							<h1 className="text-2xl md:text-4xl font-epilogue">
								welcome to <span className=" font-normal">this</span>
								<span className="font-bold">page</span>!
							</h1>
							<p className="md:text-xl">to get started, create a club or join a club through an invite link.</p>
						</div>
					)
				) : (
					<>
						<ClubBookSkeleton />
						<ClubBookSkeleton />
					</>
				)
			) : (
				<div className="p-3 md:p-4 flex flex-col justify-center items-center h-full text-destructive space-y-2">
					<div className="flex flex-row justify-center items-center w-full">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-16 mr-2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
							/>
						</svg>
						<div>
							<p>{(error as QueryError).message}</p>
							<p className="text-muted-foreground">{(error as QueryError).code}</p>
						</div>
					</div>
					<Button
						variant="accent"
						onClick={(e) => {
							e.preventDefault()
							refetch()
						}}
					>
						retry
					</Button>
				</div>
			)}
		</>
	)
}
