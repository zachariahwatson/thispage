"use client"

import { ClubBook, ClubBookSkeleton } from "@/components/ui/books/club"
import { Button } from "@/components/ui/buttons"
import { ClubMembershipProvider } from "@/contexts"
import { FirstLoadAnimationProvider } from "@/contexts/first-load-animation"
import { useClubs } from "@/hooks/state"
import { QueryError } from "@/utils/errors"

/**
 * returns a list of book clubs. we can't use suspense here as we need the fetch to be called from the client in order to preserve auth cookies. <Suspense> only works with async components and client components can't be async.
 */
export function ClubBooks() {
	const { data: clubMemberships, isLoading: loading, error, refetch } = useClubs()

	return !error ? (
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
					<h1 className="text-2xl md:text-4xl">
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
	)
}
