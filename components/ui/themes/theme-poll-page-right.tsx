"use client"

import { CardDescription, CardFooter, CardHeader, CardTitle, Separator } from "@/components/ui"
import { CreatePollItemButton } from "@/components/ui/buttons"
import Countdown from "react-countdown"
import { ThemePollItems } from "@/components/ui/themes"
import { PageRight } from "@/components/ui/books"

interface Props {
	userSpreadIndex: number
}

export function ThemePollPageRight({ userSpreadIndex }: Props) {
	const pollData = {
		id: -1,
		created_at: "2024-08-30T09:54:18.723348+00:00",
		club_id: -1,
		end_date: "2024-09-01T05:00:00+00:00",
		is_locked: true,
		name: "next month's theme: sci-fi!",
		description:
			"drop the sci-fi books you've been wanting to read! we'll choose one by next week. nothing from l. ron hubbard guys, you know better.",
		is_finished: false,
		is_archived: false,
		total_votes_count: 17,
		items: [
			{
				id: -1,
				book_title: "Project Hail Mary",
				created_at: "2024-08-30T09:58:46.008377+00:00",
				poll_votes: [],
				votes_count: 8,
				creator_member_id: -1,
				book_authors: ["Andy Weir"],
				book_page_count: 476,
				book_description: null,
				book_cover_image_url: "https://covers.openlibrary.org/b/id/14567764-L.jpg",
				book_cover_image_width: 331,
				book_cover_image_height: 500,
				percent: 47,
			},
			{
				id: -2,
				book_title: "Childhood's End (Pan 70th Anniversary)",
				created_at: "2024-08-30T10:00:12.411831+00:00",
				poll_votes: [
					{
						id: 111,
						poll_item_id: 33,
					},
				],
				votes_count: 3,
				creator_member_id: -1,
				book_authors: ["Arthur C. Clarke"],
				book_page_count: 272,
				book_description: null,
				book_cover_image_url: "https://covers.openlibrary.org/b/id/8540395-L.jpg",
				book_cover_image_width: 312,
				book_cover_image_height: 500,
				percent: 17,
			},
			{
				id: -3,
				book_title: "Neuromancer",
				created_at: "2024-08-30T10:00:47.891397+00:00",
				poll_votes: [],
				votes_count: 5,
				creator_member_id: -1,
				book_authors: ["William Gibson"],
				book_page_count: 288,
				book_description: null,
				book_cover_image_url: "https://covers.openlibrary.org/b/id/13116772-L.jpg",
				book_cover_image_width: 300,
				book_cover_image_height: 450,
				percent: 29,
			},
			{
				id: -4,
				book_title: "I, Robot",
				created_at: "2024-08-30T10:01:29.735393+00:00",
				poll_votes: [],
				votes_count: 1,
				creator_member_id: -1,
				book_authors: ["Isaac Asimov"],
				book_page_count: 192,
				book_description:
					"ROBOPSYCHOLOGIST\r\nDr. Susan Calvin had seen it all when it came to robots. As a girl she had seen the early models -- mute and totally faithful. She joined U.S. Robots and Mechanical Men, Inc. when they began adapting Earth robots for work in space -- and Earth men for work with the strictly logical robots!\r\n\r\nShe had driven the first -- and only -- mind-reading robot out of its mind, and coaxed the childlike Brain to invent the interstellar engine.\r\n\r\nFinally, at the end of her career, she faced the final question: who was really in charge; and who should be?\r\n\r\nIN THESE STORIES OF THE EARLY DAYS OF ROBOTS, ISAAC ASIMOV ESTABLISHED THE THREE LAWS OF ROBOTICS AND DEMONSTRATED THE ABILITIES THAT HAVE MADE HIM ONE OF THE WORLD'S LEADING SCIENCE FICTION WRITERS.\r\n--back cover",
				book_cover_image_url: "https://covers.openlibrary.org/b/id/10491304-L.jpg",
				book_cover_image_width: 295,
				book_cover_image_height: 500,
				percent: 5,
			},
		],
		user_vote_poll_item_id: -2,
		user_has_poll_item: true,
	}
	let endDate = new Date()
	endDate.setHours(24)

	return (
		<PageRight userSpreadIndex={userSpreadIndex}>
			<CardHeader className="px-4 md:px-6 h-[calc(100%-114px)] md:h-[calc(100%-118px)] pt-4 md:pt-6">
				<div className="flex flex-row justify-between">
					<CardTitle className="text-md md:text-xl">voting phase</CardTitle>
					{pollData?.end_date && (
						<CardDescription className="flex flex-row items-center justify-center space-x-2">
							<span>
								<Countdown date={endDate} />
							</span>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-6"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
								/>
							</svg>
						</CardDescription>
					)}
				</div>
				<Separator />
				<div className="flex justify-between pr-1">
					<CardDescription className="md:text-sm text-xs">which books would you be okay with reading?</CardDescription>
					<CreatePollItemButton />
				</div>
				<ThemePollItems />
			</CardHeader>
			<CardFooter className="absolute bottom-0 flex flex-col w-full items-center space-y-2 md:p-6 p-4 pb-4 md:pb-4">
				<CardTitle className="flex flex-row text-md md:text-xl">back to start 👉</CardTitle>
			</CardFooter>
		</PageRight>
	)
}
