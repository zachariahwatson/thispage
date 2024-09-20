"use client"

import {
	Avatar,
	AvatarImage,
	Badge,
	Separator,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { useMediaQuery } from "@/hooks"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function Page() {
	const isVertical = useMediaQuery("(max-width: 768px)")
	const [repliesVisible, setRepliesVisible] = useState<boolean>(false)
	return (
		<div className="flex flex-col items-center max-w-5xl w-full space-y-4 px-2 md:px-12 pb-12 bg-page rounded-b-3xl shadow-md shadow-shadow -mt-6 border border-border">
			<div className="absolute top-[73px] bg-page max-w-5xl w-[calc(100%-1rem)] h-12 border-x border-border" />
			<div className="flex flex-col justify-center max-w-4xl w-full space-y-4">
				<div className="space-y-2">
					<div className="flex flex-row items-center relative">
						<Button className="absolute top-0 -left-[3.75rem] rounded-full hidden lg:block" variant="ghost">
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
								<AvatarImage src="/images/demo-avatar-4.png" />
							</Avatar>
						</div>
						<div className="relative max-w-[calc(100%-56px)] w-full">
							<div className="flex flex-col pr-10">
								<p className="text-md">
									Tycho Brahe • <span className="text-sm">January 1st, 1970</span>
								</p>
								<p className="text-muted-foreground italic truncate ... md:text-sm text-xs">
									The Odyssey • thispage demo club
								</p>
							</div>
							<div className="absolute right-0 top-8">
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
									<SheetContent className={`space-y-4 ${isVertical && "w-full"} overflow-scroll`}>
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
											earliest and greatest works of Western literature. Confronted by natural and supernatural threats
											— shipwrecks, battles, monsters and the implacable enmity of the sea-god Poseidon — Odysseus must
											use his wit and native cunning if he is to reach his homeland safely and overcome the obstacles
											that, even there, await him.
										</SheetDescription>
									</SheetContent>
								</Sheet>
							</div>
						</div>
					</div>
					<h1 className="text-lg md:text-2xl font-bold break-words pr-16 font-epilogue">
						what do you guys think so far?
					</h1>
					<p className="md:text-md text-sm break-words">
						it's a slow burn for me. also when does homer simpson come into play? HA
					</p>
					<button className="mr-2 -mt-1.5">
						<Badge variant="default" className="px-1">
							<span className="min-w-3">3</span>
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
								<path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
							</svg>
						</Badge>
					</button>
				</div>
				<div className="pr-2">
					<Separator />
				</div>
				<div className="space-y-4">
					<div className="space-y-2">
						<div className="flex flex-row items-start">
							<div className="mr-4">
								<Avatar className="w-8 h-8 md:w-10 md:h-10">
									<AvatarImage src="/images/demo-avatar-2.png" />
								</Avatar>
							</div>
							<div className="relative w-full space-y-2">
								<div className="flex flex-col space-y-2 w-full">
									<p className="text-md">
										Albert Einstein • <span className="text-sm">January 1st, 1970</span>
									</p>
									<p className="md:text-md text-sm w-full">i'm liking it!</p>
									<div className="flex flex-row">
										<button className="mr-2 -mt-1.5">
											<Badge variant="outline" className="px-1">
												<span className="min-w-3">2</span>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="currentColor"
													className="size-4"
												>
													<path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
												</svg>
											</Badge>
										</button>
									</div>
								</div>
								{repliesVisible ? (
									<>
										<div className="space-y-2">
											<div className="flex flex-row items-start">
												<div className="mr-4">
													<Avatar className="w-8 h-8 md:w-10 md:h-10">
														<AvatarImage src="/images/demo-avatar-7.png" />
													</Avatar>
												</div>
												<div className="relative w-full">
													<div className="flex flex-col space-y-2 w-full">
														<p className="text-md">
															Carl Gauss • <span className="text-sm">January 1st, 1970</span>{" "}
														</p>
														<p className="md:text-md text-sm w-full">same here!</p>
														<div className="flex flex-row">
															<button className="mr-2 -mt-1.5">
																<Badge variant="outline" className="px-1">
																	<span className="min-w-3">1</span>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		viewBox="0 0 24 24"
																		fill="currentColor"
																		className="size-4"
																	>
																		<path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
																	</svg>
																</Badge>
															</button>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="space-y-2">
											<div className="flex flex-row items-start">
												<div className="mr-4">
													<Avatar className="w-8 h-8 md:w-10 md:h-10">
														<AvatarImage src="/images/demo-avatar-3.png" />
													</Avatar>
												</div>
												<div className="relative w-full">
													<div className="flex flex-col space-y-2 w-full">
														<p className="text-md">
															Nikola Tesla • <span className="text-sm">January 1st, 1970</span>{" "}
														</p>
														<p className="md:text-md text-sm w-full">meh. it's okay</p>
														<div className="flex flex-row">
															<button className="mr-2 -mt-1.5">
																<Badge variant="outline" className="px-1">
																	<span className="min-w-3">0</span>
																	<svg
																		xmlns="http://www.w3.org/2000/svg"
																		viewBox="0 0 24 24"
																		fill="currentColor"
																		className="size-4"
																	>
																		<path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
																	</svg>
																</Badge>
															</button>
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
									<AvatarImage src="/images/demo-avatar-6.png" />
								</Avatar>
							</div>
							<div className="relative w-full space-y-2">
								<div className="flex flex-col space-y-2 w-full">
									<p className="text-md">
										Galileo Galilei • <span className="text-sm">January 1st, 1970</span>
									</p>
									<p className="md:text-md text-sm w-full">I HATE IT! I HATE IT! I HATE IT!</p>
									<div className="flex flex-row">
										<button className="mr-2 -mt-1.5">
											<Badge variant="outline" className="px-1">
												<span className="min-w-3">20</span>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													viewBox="0 0 24 24"
													fill="currentColor"
													className="size-4"
												>
													<path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
												</svg>
											</Badge>
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
