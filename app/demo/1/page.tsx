"use client"

import {
	Avatar,
	AvatarImage,
	Badge,
	Post,
	Separator,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { redirect } from "next/navigation"
import Image from "next/image"
import { useMediaQuery } from "@/hooks"
import { useState } from "react"

export default function Page() {
	const isVertical = useMediaQuery("(max-width: 768px)")
	const [repliesVisible, setRepliesVisible] = useState<boolean>(false)
	return (
		<div className="flex flex-col justify-center max-w-4xl w-full space-y-4">
			<div className="space-y-2">
				<div className="flex flex-row items-center relative">
					<Button className="absolute top-0 -left-16 rounded-full hidden lg:block" variant="ghost">
						<Link href={`/`}>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="w-6 h-6"
							>
								<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
							</svg>
						</Link>
					</Button>
					<div className="mr-4">
						<Avatar className="w-8 h-8 md:w-10 md:h-10">
							<AvatarImage src="/images/default-avatar.png" />
						</Avatar>
					</div>
					<div className="relative max-w-[calc(100%-56px)] w-full">
						<div className="flex flex-col pr-10">
							<p className="text-md">
								Lorem Ipsum • <span className="text-sm">January 1st, 1970</span>
							</p>
							<p className="text-muted-foreground italic truncate ... md:text-sm text-xs">
								The Odyssey • thispage demo club
							</p>
						</div>
						<div className="absolute right-0 top-0">
							<Sheet>
								<SheetTrigger className="hover:ring-4 hover:ring-ring rounded transition-all">
									<Image
										className="rounded h-10 md:h-16 w-auto shadow-shadow shadow-md"
										src="/images/demo-cover.png"
										width={297}
										height={475}
										alt="Cover photo of The Odyssey by Homer"
									/>
								</SheetTrigger>
								<SheetContent className={`space-y-4 ${isVertical && "w-full"}`}>
									<SheetHeader className="text-left">
										<SheetTitle>The Odyssey</SheetTitle>
										<SheetDescription className="italic">by Homer</SheetDescription>
									</SheetHeader>
									<Image
										className="rounded-lg w-full max-h-full shadow-shadow shadow-md"
										src="/images/demo-cover.png"
										width={297}
										height={475}
										alt="Cover photo of The Odyssey by Homer"
									/>
									<SheetDescription className="italic">
										The epic tale of Odysseus and his ten-year journey home after the Trojan War forms one of the
										earliest and greatest works of Western literature. Confronted by natural and supernatural threats —
										shipwrecks, battles, monsters and the implacable enmity of the sea-god Poseidon — Odysseus must use
										his wit and native cunning if he is to reach his homeland safely and overcome the obstacles that,
										even there, await him.
									</SheetDescription>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</div>
				<h1 className="text-lg md:text-2xl font-bold">what do you guys think so far?</h1>
				<p className="md:text-md text-sm">
					blah blah blah this is the content of the post. funnily enough i've never read this book so i will type an
					adequate amount until it looks like an actual post.
				</p>
				<Button className="p-0 bg-background hover:bg-background mr-2" variant="secondary">
					<Badge variant="outline">3 👍</Badge>
				</Button>
			</div>
			<div className="pr-2">
				<Separator />
			</div>
			<div className="space-y-4">
				<div className="space-y-2">
					<div className="flex flex-row items-start">
						<div className="mr-4">
							<Avatar className="w-8 h-8 md:w-10 md:h-10">
								<AvatarImage src="/images/default-avatar.png" />
							</Avatar>
						</div>
						<div className="relative w-full space-y-2">
							<div className="flex flex-col space-y-2 w-full">
								<p className="text-md">
									Lorem Ipsum • <span className="text-sm">January 1st, 1970</span>
								</p>
								<p className="md:text-md text-sm w-full">i'm liking it!</p>
								<div className="flex flex-row">
									<Button className="p-0 bg-background hover:bg-background mr-2 justify-start" variant="secondary">
										<Badge variant="outline" className="">
											2 👍
										</Badge>
									</Button>
								</div>
							</div>
							{repliesVisible ? (
								<>
									<div className="space-y-2">
										<div className="flex flex-row items-start">
											<div className="mr-4">
												<Avatar className="w-8 h-8 md:w-10 md:h-10">
													<AvatarImage src="/images/default-avatar.png" />
												</Avatar>
											</div>
											<div className="relative w-full">
												<div className="flex flex-col space-y-2 w-full">
													<p className="text-md">
														Lorem Ipsum • <span className="text-sm">January 1st, 1970</span>{" "}
													</p>
													<p className="md:text-md text-sm w-full">same here!</p>
													<div className="flex flex-row">
														<Button
															className="p-0 bg-background hover:bg-background mr-2 justify-start"
															variant="secondary"
														>
															<Badge variant="outline" className="">
																1 👍
															</Badge>
														</Button>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="space-y-2">
										<div className="flex flex-row items-start">
											<div className="mr-4">
												<Avatar className="w-8 h-8 md:w-10 md:h-10">
													<AvatarImage src="/images/default-avatar.png" />
												</Avatar>
											</div>
											<div className="relative w-full">
												<div className="flex flex-col space-y-2 w-full">
													<p className="text-md">
														Lorem Ipsum • <span className="text-sm">January 1st, 1970</span>{" "}
													</p>
													<p className="md:text-md text-sm w-full">meh. it's okay</p>
													<div className="flex flex-row">
														<Button
															className="p-0 bg-background hover:bg-background mr-2 justify-start"
															variant="secondary"
														>
															<Badge variant="outline" className="">
																0 👍
															</Badge>
														</Button>
													</div>
												</div>
											</div>
										</div>
									</div>
									<Button variant="link" onClick={() => setRepliesVisible(false)} className="text-muted-foreground">
										hide
									</Button>
								</>
							) : (
								<Button variant="link" onClick={() => setRepliesVisible(true)} className="text-muted-foreground">
									view replies
								</Button>
							)}
						</div>
					</div>
				</div>
				<div className="space-y-2">
					<div className="flex flex-row items-start">
						<div className="mr-4">
							<Avatar className="w-8 h-8 md:w-10 md:h-10">
								<AvatarImage src="/images/default-avatar.png" />
							</Avatar>
						</div>
						<div className="relative w-full space-y-2">
							<div className="flex flex-col space-y-2 w-full">
								<p className="text-md">
									Lorem Ipsum • <span className="text-sm">January 1st, 1970</span>
								</p>
								<p className="md:text-md text-sm w-full">I HATE IT! I HATE IT! I HATE IT!</p>
								<div className="flex flex-row">
									<Button className="p-0 bg-background hover:bg-background mr-2 justify-start" variant="secondary">
										<Badge variant="outline" className="">
											20 👍
										</Badge>
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
