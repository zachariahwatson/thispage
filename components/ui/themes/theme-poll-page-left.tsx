"use client"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Progress,
	Separator,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui"
import {
	ArchiveButton,
	CompleteIntervalButton,
	JoinReadingButton,
	PollActionsButton,
	ReadingActionsButton,
} from "@/components/ui/buttons"
import { useClubMembership, useFirstLoadAnimation, usePoll, useReading } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import { useIntervals, useUserProgress } from "@/hooks/state"
import { motion } from "framer-motion"
import Image from "next/image"
import { useState } from "react"
import { ThemePollPodium } from "@/components/ui/themes"

interface Props {
	userSpreadIndex: number
}

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

export function ThemePollPageLeft({ userSpreadIndex }: Props) {
	const MotionCard = motion(Card)
	const [flipOnce, setFlipOnce] = useState<boolean>(false)
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
	const isVertical = useMediaQuery("(max-width: 768px)")

	//framer motion responsive animation (turns book page flip into notepad page flip)
	const leftVariants = isVertical
		? {
				initial: { rotateX: flipOnce ? 0 : -90, originY: 1, zIndex: 2 },
				animate: { rotateX: 0, originY: 1, zIndex: 2 },
		  }
		: {
				initial: { rotateY: flipOnce ? 0 : 90, originX: 1, zIndex: 2 },
				animate: { rotateY: 0, originX: 1, zIndex: 2 },
		  }

	return (
		<MotionCard
			className="bg-page flex-1 h-1/2 md:h-full md:w-1/2 relative border-b-0 rounded-b-none md:border-b md:rounded-b-lg md:border-r-0 md:rounded-tr-none md:rounded-br-none shadow-shadow-dark shadow-md"
			variants={leftVariants}
			initial="initial"
			animate="animate"
			transition={{ type: "tween", duration: 0.1, delay: 0.1, ease: "easeIn" }}
			style={{ transformPerspective: 2500 }}
			onAnimationComplete={() => setFlipOnce(true)}
		>
			<>
				<CardHeader className="px-4 md:px-6 relative h-full pt-4 md:pt-6">
					<CardTitle className="text-md md:text-xl flex flex-row items-center">
						demo poll
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="size-4 md:size-6 mx-2"
						>
							<path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
						</svg>
					</CardTitle>
					<Separator />
					<CardTitle className="text-sm md:text-lg text-wrap break-words">{pollData?.name}</CardTitle>
					<CardDescription className="text-xs md:text-sm break-words">{pollData?.description}</CardDescription>
					<Separator />
					<ThemePollPodium />
				</CardHeader>
			</>
			<div className="bg-gradient-to-l from-shadow to-page py-2 hidden md:block absolute h-full top-0 right-0">
				<Separator orientation="vertical" className="ml-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<div className="bg-gradient-to-t from-shadow to-page px-2 block md:hidden absolute w-full bottom-0 right-0">
				<Separator orientation="horizontal" className="mt-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs hidden md:block text-page-foreground/30">{userSpreadIndex + 1}</p>
		</MotionCard>
	)
}
