"use client"

import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui"
import { ThemePollPodiumBook } from "@/components/ui/themes"
import { usePoll } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import Image from "next/image"
import { useEffect, useRef } from "react"

export function ThemePollPodium() {
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
	const topThree = pollData?.items.toSorted((a, b) => b.votes_count - a.votes_count).slice(0, 3) ?? []
	const flexBoxRef = useRef<HTMLDivElement | null>(null)

	return (
		<div ref={flexBoxRef} className="flex flex-row flex-grow items-end max-h-1/4">
			<div className="bg-secondary flex-1 h-1/3 rounded-l-sm md:rounded-l-md border-border border-[1px] border-r-secondary flex justify-center items-start md:pt-2 relative">
				<ThemePollPodiumBook flexBoxRef={flexBoxRef} item={topThree[1]} />
				<p className="text-muted-foreground">{pollData?.total_votes_count ? Math.trunc(topThree[1]?.percent) : 0}%</p>
			</div>
			<div className="flex flex-col flex-1 h-1/2">
				<div className="bg-secondary h-1/3 rounded-t-sm md:rounded-t-md border-border border-[1px] border-b-secondary flex justify-center items-start md:pt-2 relative">
					<ThemePollPodiumBook flexBoxRef={flexBoxRef} item={topThree[0]} winner />
					<p className="text-muted-foreground">{pollData?.total_votes_count ? Math.trunc(topThree[0]?.percent) : 0}%</p>
				</div>
				<div className="flex flex-row h-2/3">
					<div className="bg-secondary border-border border-b-[1px] w-1/2"></div>
					<div className="flex flex-col w-1/2">
						<div className="bg-secondary border-border border-r-[1px] h-1/4 w-full"></div>
						<div className="bg-secondary border-border border-b-[1px] h-3/4 w-full"></div>
					</div>
				</div>
			</div>
			<div className="bg-secondary flex-1 h-1/4 rounded-r-sm md:rounded-r-md border-border border-[1px] border-l-secondary flex justify-center items-start md:pt-2 relative">
				<ThemePollPodiumBook flexBoxRef={flexBoxRef} item={topThree[2]} />
				<p className="text-muted-foreground">{pollData?.total_votes_count ? Math.trunc(topThree[2]?.percent) : 0}%</p>
			</div>
		</div>
	)
}
