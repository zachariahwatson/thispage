"use client"

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Carousel,
	CarouselContent,
	CarouselItem,
	Progress,
	Separator,
} from "@/components/ui"
import { Button } from "@/components/ui/buttons"
import { useMediaQuery } from "@/hooks"
import AutoScroll from "embla-carousel-auto-scroll"
import { motion } from "framer-motion"
import Image from "next/image"
import { PageLeft } from "@/components/ui/books"

interface Props {
	userSpreadIndex: number
}

export function DemoPageLeft2({ userSpreadIndex }: Props) {
	const isLong = useMediaQuery("(max-height: 811px)")

	return (
		<PageLeft userSpreadIndex={userSpreadIndex} id={`demo-page-left-2`}>
			<CardContent className="md:space-y-4 pt-4">
				<div className="space-y-2">
					<CardTitle className="text-md md:text-xl">
						<span className="font-black text-ring">create</span> multiple readings per club.
					</CardTitle>
					<CardDescription className="text-xs md:text-sm">
						readers can pick specific books they want to participate in.
					</CardDescription>
					<Carousel opts={{ loop: true }} plugins={[AutoScroll({ startDelay: 200, stopOnInteraction: false })]}>
						<CarouselContent className="rounded-md">
							<CarouselItem>
								<Card className="bg-page relative shadow-shadow shadow-md min-h-[158px] h-[calc(50svh-184px)] md:h-[calc(100%-68px)]">
									<div className="flex justify-center px-12 pb-16 pt-2 md:pt-4 h-full w-full">
										<Image
											className="rounded-[8px] md:rounded-md h-full w-auto"
											src="/images/demo-cover-3.png"
											width={400}
											height={610}
											alt="Cover photo of The Odyssey by Homer"
											loading="eager"
										/>
									</div>

									<Card className="absolute bottom-0 w-full border-b-0 border-l-0 border-r-0 border-page/90 -space-y-4 md:space-y-0 shadow-shadow shadow-[0_-4px_6px_-4px_hsl(var(--shadow))] backdrop-blur-md bg-page/80">
										{!isLong && (
											<>
												<CardHeader className="pb-6 pt-2 md:pt-4 md:py-4 md:px-6 px-4">
													<CardTitle className="text-md md:text-2xl">The Great Gatsby</CardTitle>
													<CardDescription className="italic text-xs md:text-sm">
														by F. Scott Fitzgerald
													</CardDescription>
												</CardHeader>
												<div className="px-4">
													<Separator />
												</div>
											</>
										)}

										<CardContent className={`pr-0 ${!isLong ? "pt-6" : "pt-2"} md:pt-2 md:px-6 px-4`}>
											<CardDescription className="text-xs md:text-sm">read to...</CardDescription>
											<div className="flex flex-row">
												<p className="font-bold italic md:text-xl">
													p.
													<span className="text-5xl md:text-8xl not-italic">120</span>
												</p>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth={1}
													stroke="currentColor"
													className="w-12 md:w-14 h-12 md:h-14 self-center"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
													/>
												</svg>
												<div className="self-center">
													<motion.div
														className="w-12 md:w-24 h-12 md:h-24 p-0 rounded-full text-primary"
														initial={{
															scale: 1.1,
														}}
														animate={{
															scale: 1,
														}}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															strokeWidth={1.5}
															stroke="currentColor"
															className="w-12 md:w-24 h-12 md:h-24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
															/>
														</svg>
													</motion.div>
												</div>
											</div>
											<CardDescription className="italic text-xs md:text-sm">
												12/16 readers have completed
											</CardDescription>
										</CardContent>
										<CardFooter className="md:px-6 px-4 pb-2 md:pb-4">
											<Progress value={Math.floor((110 / 180) * 100)} className="h-2 md:h-4" />
										</CardFooter>
									</Card>
								</Card>
							</CarouselItem>

							<CarouselItem>
								<Card className="bg-page relative shadow-shadow shadow-md min-h-[158px] h-[calc(50svh-184px)] md:h-[calc(100%-68px)]">
									<div className="flex justify-center px-12 pb-16 pt-2 md:pt-4 h-full w-full">
										<Image
											className="rounded-[8px] md:rounded-md h-full w-auto"
											src="/images/demo-cover-4.png"
											width={294}
											height={475}
											alt="Cover photo of The Odyssey by Homer"
											loading="eager"
										/>
									</div>

									<Card className="absolute bottom-0 w-full border-b-0 border-l-0 border-r-0 border-page/90 -space-y-4 md:space-y-0 shadow-shadow shadow-[0_-4px_6px_-4px_hsl(var(--shadow))] backdrop-blur-md bg-page/80">
										{!isLong && (
											<>
												<CardHeader className="pb-6 pt-2 md:pt-4 md:py-4 md:px-6 px-4">
													<CardTitle className="text-md md:text-2xl">The Catcher in the Rye</CardTitle>
													<CardDescription className="italic text-xs md:text-sm">by J.D. Salinger</CardDescription>
												</CardHeader>
												<div className="px-4">
													<Separator />
												</div>
											</>
										)}

										<CardContent className={`pr-0 ${!isLong ? "pt-6" : "pt-2"} md:pt-2 md:px-6 px-4`}>
											<div className="w-full h-full flex justify-center items-center pt-8">
												<Button size={isLong ? "sm" : "default"}>join reading</Button>
											</div>
										</CardContent>
									</Card>
								</Card>
							</CarouselItem>
							<CarouselItem>
								<Card className="bg-page relative shadow-shadow shadow-md min-h-[158px] h-[calc(50svh-184px)] md:h-[calc(100%-68px)]">
									<div className="flex justify-center px-12 pb-16 pt-2 md:pt-4 h-full w-full">
										<Image
											className="rounded-[8px] md:rounded-md h-full w-auto"
											src="/images/demo-cover.png"
											width={1519}
											height={2371}
											alt="Cover photo of The Odyssey by Homer"
											loading="eager"
										/>
									</div>

									<Card className="absolute bottom-0 w-full border-b-0 border-l-0 border-r-0 border-page/90 -space-y-4 md:space-y-0 shadow-shadow shadow-[0_-4px_6px_-4px_hsl(var(--shadow))] backdrop-blur-md bg-page/80">
										{!isLong && (
											<>
												<CardHeader className="pb-6 pt-2 md:pt-4 md:py-4 md:px-6 px-4">
													<CardTitle className="text-md md:text-2xl">The Odyssey</CardTitle>
													<CardDescription className="italic text-xs md:text-sm">by Homer</CardDescription>
												</CardHeader>
												<div className="px-4">
													<Separator />
												</div>
											</>
										)}

										<CardContent className={`pr-0 ${!isLong ? "pt-6" : "pt-2"} md:pt-2 md:px-6 px-4`}>
											<CardDescription className="text-xs md:text-sm">read to...</CardDescription>
											<div className="flex flex-row">
												<p className="font-bold italic md:text-xl">
													book.
													<span className="text-5xl md:text-8xl not-italic">12</span>
												</p>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													fill="none"
													viewBox="0 0 24 24"
													strokeWidth={1}
													stroke="currentColor"
													className="w-12 md:w-14 h-12 md:h-14 self-center"
												>
													<path
														strokeLinecap="round"
														strokeLinejoin="round"
														d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
													/>
												</svg>
												<div className="self-center">
													<motion.div
														className="w-12 md:w-24 h-12 md:h-24 p-0 rounded-full text-primary"
														initial={{
															scale: 1.1,
														}}
														animate={{
															scale: 1,
														}}
													>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
															strokeWidth={1.5}
															stroke="currentColor"
															className="w-12 md:w-24 h-12 md:h-24"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
															/>
														</svg>
													</motion.div>
												</div>
											</div>
											<CardDescription className="italic text-xs md:text-sm">
												4/8 readers have completed
											</CardDescription>
										</CardContent>
										<CardFooter className="md:px-6 px-4 pb-2 md:pb-4">
											<Progress value={Math.floor((40 / 348) * 100)} className="h-2 md:h-4" />
										</CardFooter>
									</Card>
								</Card>
							</CarouselItem>

							<CarouselItem>
								<Card className="bg-page relative shadow-shadow shadow-md min-h-[158px] h-[calc(50svh-184px)] md:h-[calc(100%-68px)]">
									<div className="flex justify-center px-12 pb-16 pt-2 md:pt-4 h-full w-full">
										<Image
											className="rounded-[8px] md:rounded-md h-full w-auto"
											src="/images/demo-cover-2.png"
											width={383}
											height={600}
											alt="Cover photo of The Odyssey by Homer"
											loading="eager"
										/>
									</div>

									<Card className="absolute bottom-0 w-full border-b-0 border-l-0 border-r-0 border-page/90 -space-y-4 md:space-y-0 shadow-shadow shadow-[0_-4px_6px_-4px_hsl(var(--shadow))] backdrop-blur-md bg-page/80">
										{!isLong && (
											<>
												<CardHeader className="pb-6 pt-2 md:pt-4 md:py-4 md:px-6 px-4">
													<CardTitle className="text-md md:text-2xl">1984</CardTitle>
													<CardDescription className="italic text-xs md:text-sm">by George Orwell</CardDescription>
												</CardHeader>
												<div className="px-4">
													<Separator />
												</div>
											</>
										)}

										<CardContent className={`pr-0 ${!isLong ? "pt-6" : "pt-2"} md:pt-2 md:px-6 px-4`}>
											<div className="w-full h-full flex justify-center items-center pt-8">
												<Button size={isLong ? "sm" : "default"}>join reading</Button>
											</div>
										</CardContent>
									</Card>
								</Card>
							</CarouselItem>
						</CarouselContent>
					</Carousel>
				</div>
			</CardContent>
		</PageLeft>
	)
}
