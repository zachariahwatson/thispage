"use client"

import {
	BookDetails,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Progress,
	Separator,
	Sheet,
	SheetTrigger,
} from "@/components/ui"
import { ArchiveButton, CompleteIntervalButton, JoinReadingButton, ReadingActionsButton } from "@/components/ui/buttons"
import { useClubMembership, useReading } from "@/contexts"
import Image from "next/image"
import { PageLeft } from "@/components/ui/books"
import TimeAgo from "javascript-time-ago"
import { UserCheck } from "lucide-react"

interface Props {
	userSpreadIndex: number
}

export function ReadingPageLeft({ userSpreadIndex }: Props) {
	const readingData = useReading()
	const clubMembership = useClubMembership()
	const startDate = new Date(readingData?.start_date || "")

	//concat user progress to intervals
	const memberProgresses = [readingData?.interval?.user_progress].concat(
		readingData?.interval?.member_interval_progresses
	)

	const timeAgo = new TimeAgo("en-US")

	return (
		<PageLeft
			userSpreadIndex={userSpreadIndex}
			id={`club-${readingData?.club_id}-reading-${readingData?.id}-page-left`}
		>
			<CardHeader className="px-4 md:px-6 relative pt-2 md:pt-6 pb-2 md:pb-6">
				<CardTitle className="text-md md:text-xl flex flex-row items-center">
					reading
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
							d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
						/>
					</svg>
				</CardTitle>
				<Separator />
			</CardHeader>
			{/* <div className="flex justify-center px-12 pb-16"> */}
			<div className="h-[calc(100%-8.5rem)] flex justify-center items-start px-3 md:px-6">
				<Sheet>
					<SheetTrigger asChild>
						<Image
							className="rounded-sm md:rounded-lg hover:cursor-pointer object-contain w-auto h-auto max-h-full shadow-[4px_4px_6px_-1px_hsl(var(--shadow))] shadow-shadow"
							src={readingData?.book_cover_image_url || ""}
							width={readingData?.book_cover_image_width || 0}
							height={readingData?.book_cover_image_height || 0}
							alt=""
							loading="eager"
							priority
						/>
					</SheetTrigger>
					<BookDetails
						bookTitle={readingData?.book_title}
						coverUrl={readingData?.book_cover_image_url || ""}
						coverWidth={readingData?.book_cover_image_width || 0}
						coverHeight={readingData?.book_cover_image_height || 0}
						authors={readingData?.book_authors ?? undefined}
						description={readingData?.book_description ?? undefined}
					/>
				</Sheet>
			</div>
			{/* </div> */}

			<ReadingActionsButton />

			<Card className="absolute bottom-0 w-full border-b-0 border-l-0 border-r-0 border-page/90 -space-y-4 md:space-y-0 shadow-shadow shadow-[0_-4px_6px_-4px_hsl(var(--shadow))] backdrop-blur-md bg-page/80 rounded-none rounded-t-lg md:rounded-none md:rounded-l-lg">
				<CardHeader className="pb-4 md:pb-6 pt-2 md:pt-4 md:py-4 md:px-6 px-4 space-y-0">
					<CardTitle className="text-xl md:text-2xl truncate ..." title={readingData?.book_title}>
						{readingData?.book_title}
					</CardTitle>
					<CardDescription
						className="italic truncate ..."
						title={
							readingData?.book_authors
								? " by " +
								  (readingData?.book_authors.length === 2
										? readingData?.book_authors.join(" and ")
										: readingData?.book_authors
												.map((author: string, i: number) => {
													if (
														i === (readingData?.book_authors ? readingData.book_authors?.length - 1 : 0) &&
														readingData.book_authors?.length !== 1
													) {
														return "and " + author
													} else {
														return author
													}
												})
												.join(", "))
								: undefined
						}
					>
						{readingData?.book_authors
							? " by " +
							  (readingData?.book_authors.length === 2
									? readingData?.book_authors.join(" and ")
									: readingData?.book_authors
											.map((author: string, i: number) => {
												if (
													i === (readingData?.book_authors ? readingData.book_authors?.length - 1 : 0) &&
													readingData.book_authors?.length !== 1
												) {
													return "and " + author
												} else {
													return author
												}
											})
											.join(", "))
							: null}
					</CardDescription>
				</CardHeader>

				<div className="px-4 pt-2 md:pt-0">
					<Separator />
				</div>

				<CardContent className="pr-0 pt-5 md:pt-2 md:px-6 px-4">
					{readingData?.interval?.user_progress &&
						(!readingData?.is_finished ? (
							startDate.getTime() > Date.now() ? (
								<div className="w-full h-full flex justify-center items-center pt-8">
									<p className="text-muted-foreground" title={startDate.toUTCString()}>
										🚧this reading will start {timeAgo.format(startDate)}🚧
									</p>
								</div>
							) : (
								<>
									<CardDescription>read to...</CardDescription>
									<div className="flex flex-row items-center">
										{readingData?.increment_type === "pages" ? (
											<p className="font-bold italic md:text-xl">
												p.
												<span
													className={`ml-1 text-6xl ${
														readingData?.interval?.goal_page && readingData?.interval?.goal_page < 1000
															? "md:text-8xl"
															: "md:text-7xl"
													} not-italic`}
												>
													{readingData?.interval?.goal_page}
												</span>
											</p>
										) : (
											<p className="font-bold italic md:text-xl">
												{readingData?.section_name}.
												<span
													className={`ml-1 text-6xl ${
														readingData?.interval?.goal_section && readingData?.interval?.goal_section < 1000
															? "md:text-8xl"
															: "md:text-7xl"
													} not-italic`}
												>
													{readingData?.interval?.goal_section}
												</span>
											</p>
										)}

										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1}
											stroke="currentColor"
											className="w-12 md:w-14 h-12 md:h-14 self-center"
										>
											<path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
										</svg>
										<div className="flex flex-row items-center">
											{/**
											 * @todo add dialog box confirming if the user wants to complete the reading if they're the last member to do so
											 */}
											<CompleteIntervalButton />
											<div
												className={`flex flex-col items-center justify-center ${
													readingData?.interval?.user_progress && readingData?.interval?.user_progress?.is_complete
														? "text-primary"
														: "text-muted-foreground"
												}`}
												title={`${memberProgresses.filter((progress) => progress?.is_complete).length}/${
													memberProgresses.length
												} readers have completed the current reading goal`}
											>
												<UserCheck strokeWidth={1.5} />
												<CardDescription className="italic">
													{memberProgresses.filter((progress) => progress?.is_complete).length}/
													{memberProgresses.length}
												</CardDescription>
											</div>
										</div>
									</div>
								</>
							)
						) : (
							<div className="w-full h-full flex justify-center items-center pt-8">
								<p className="text-muted-foreground">🎉reading finished!🎉</p>
							</div>
						))}
					<div className="w-full h-full flex justify-center items-center">
						{!readingData?.interval?.user_progress &&
							(!readingData?.join_in_progress && new Date().getTime() > startDate.getTime() ? (
								<p className="text-muted-foreground mt-4">sorry, this reading has already started :(</p>
							) : (
								<JoinReadingButton />
							))}
						{clubMembership?.role === "admin" && readingData?.is_finished && <ArchiveButton />}
					</div>
				</CardContent>
				<CardFooter className="md:px-6 px-4">
					{readingData?.increment_type === "pages" ? (
						readingData?.interval?.goal_page && readingData?.book_page_count ? (
							<Progress
								value={
									!readingData.is_finished
										? Math.floor(
												((readingData?.interval?.goal_page - readingData.interval_page_length) /
													readingData?.book_page_count) *
													100
										  )
										: 100
								}
								className="h-2 md:h-4"
								title={`${
									!readingData.is_finished
										? Math.floor(
												((readingData?.interval?.goal_page - readingData.interval_page_length) /
													readingData?.book_page_count) *
													100
										  )
										: 100
								}%`}
							/>
						) : (
							<></>
						)
					) : (
						readingData?.interval?.goal_section &&
						readingData?.book_sections && (
							<Progress
								value={
									!readingData.is_finished
										? Math.floor(
												((readingData?.interval?.goal_section - readingData.interval_section_length) /
													readingData?.book_sections) *
													100
										  )
										: 100
								}
								className="h-2 md:h-4"
								title={`${
									!readingData.is_finished
										? Math.floor(
												((readingData?.interval?.goal_section - readingData.interval_section_length) /
													readingData?.book_sections) *
													100
										  )
										: 100
								}%`}
							/>
						)
					)}
				</CardFooter>
			</Card>
		</PageLeft>
	)
}
