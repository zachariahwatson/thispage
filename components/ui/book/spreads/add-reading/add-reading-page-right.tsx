"use client"

import {
	AddReadingForm,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	Separator,
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui"
import { useClubMembership } from "@/contexts"
import { useMediaQuery } from "@/hooks"
import { useReadings } from "@/hooks/state"
import { motion } from "framer-motion"
import { useState } from "react"
import { useMutation, useQueryClient } from "react-query"
import { toast } from "sonner"

const defaultUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
	? `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
	: "http://localhost:3000"

interface Props {
	readingIndex: number
}

export function AddReadingPageRight({ readingIndex }: Props) {
	const isVertical = useMediaQuery("(max-width: 768px)")
	const [addReadingVisible, setAddReadingVisible] = useState(false)
	const MotionCard = motion(Card)
	const clubMembership = useClubMembership()

	const { data: readings, isLoading: loading } = useReadings(clubMembership?.club.id || -1)

	const queryClient = useQueryClient()

	const readingMutation = useMutation({
		mutationFn: (data: {
			book: {
				open_library_id: string
				title?: string | undefined
				description?: string | undefined
				authors?: string[] | undefined
				page_count?: number | undefined
				cover_image_url?: string | undefined
				cover_image_width?: number | undefined
				cover_image_height?: number | undefined
			}
			club_id: number
			creator_member_id: number
			interval_page_length?: number
			interval_section_length?: number
			start_date: Date
			join_in_progress: boolean
			increment_type: "pages" | "sections"
			book_sections?: number | undefined
			section_name?: string | undefined
		}) => {
			const url = new URL(`${defaultUrl}/api/clubs/${clubMembership?.club.id}/readings`)
			return fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})
		},
		onSuccess: () => {
			toast.success("reading successfully created")
			queryClient.invalidateQueries(["readings", clubMembership?.club.id])
		},
	})

	const rightVariants = isVertical
		? {
				initial: { rotateX: 0, originY: 0, zIndex: 2 },
				animate: { rotateX: 90, originY: 0, zIndex: 2 },
				exit: { rotateX: 90, originY: 0, zIndex: 2 },
		  }
		: {
				initial: { rotateY: 0, originX: 0, zIndex: 2 },
				animate: { rotateY: -90, originX: 0, zIndex: 2 },
				exit: { rotateY: -90, originX: 0, zIndex: 2 },
		  }

	return (
		<MotionCard
			className="bg-background flex-1 h-1/2 md:h-full md:w-1/2 border-t-0 rounded-t-none md:border-t md:rounded-t-lg md:border-l-0 md:rounded-tl-none md:rounded-bl-none shadow-shadow shadow-md relative"
			variants={rightVariants}
			exit="exit"
			transition={{ type: "tween", duration: 0.1, ease: "easeOut" }}
			style={{ transformPerspective: 2500 }}
		>
			<CardHeader className="px-4 md:px-6">
				<div className="flex justify-between pr-1">
					<CardTitle className="text-xl">add a reading</CardTitle>
				</div>
			</CardHeader>
			{!loading && readings && readings.length < 4 ? (
				<>
					<Sheet open={addReadingVisible} onOpenChange={setAddReadingVisible}>
						<SheetTrigger>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-48 absolute top-[calc(50%-6rem)] right-[calc(50%-6rem)] text-secondary"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
								/>
							</svg>
						</SheetTrigger>
						<SheetContent className="sm:max-w-xl max-w-xl w-full space-y-4 overflow-scroll">
							<SheetHeader>
								<SheetTitle>add a reading</SheetTitle>
							</SheetHeader>
							<AddReadingForm mutation={readingMutation} setVisible={setAddReadingVisible} />
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
			<div className="bg-gradient-to-r from-shadow to-background py-2 hidden md:block absolute h-full top-0 left-0">
				<Separator orientation="vertical" className="mr-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<div className="bg-gradient-to-b from-shadow to-background px-2 block md:hidden absolute w-full top-0 right-0">
				<Separator orientation="horizontal" className="mb-4 border-shadow-dark border-[.5px] border-dashed" />
			</div>
			<p className="absolute bottom-2 left-3 text-xs block md:hidden text-foreground/30">{readingIndex + 1}</p>
		</MotionCard>
	)
}
