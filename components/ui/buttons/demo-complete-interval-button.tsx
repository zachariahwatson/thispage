"use client"

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui"
import { motion } from "framer-motion"
import { Dispatch, SetStateAction } from "react"
import { toast } from "sonner"

interface Props {
	isComplete: boolean
	setIsComplete?: Dispatch<SetStateAction<boolean>>
	clicked?: boolean
	setClicked?: Dispatch<SetStateAction<boolean>>
}

export function DemoCompleteIntervalButton({ isComplete, setIsComplete, clicked, setClicked }: Props) {
	const choices = [
		`oooo you're on go mode! keep it up! 🔥`,
		`nice one! was it a good interval?`,
		`reading interval completed! 🎉`,
		`justkeepreadingjustkeepreadingjustkeepreading`,
		`#slayedthatinterval 💅`,
		`i saw how hard you read that. nice.`,
		`nice! if you read one more page i'll give you a dollar 😏`,
		`breaking news: super reader on the loose! 🚨`,
		`this just in: reader smashes interval! 📰`,
		`oh. you didn't have to read it THAT fast 💨`,
		`dang. i wish i could read like you 😔`,
		`wow... way to show everyone how to actually read!`,
		`you know you can take breaks... right?`,
		`pfft... what a nerd! reading??? a book??? 🤣`,
		`let me guess... you're on page ${Math.floor(Math.random() * 500)}. was i close?`,
		`nice one. now go take a break and frolic in a field.`,
		`interval completed! go drink some water now. you seem parched.`,
		`beep boop. interval completed. beep boop. congratulations. beep boop.`,
		`has anyone ever told you that you look like a cutie patootie when you read?`,
		`omg same, i loved that part. totally. i've read the book like 20 times soooo`,
		`it's exhausting coming up with these. sometimes i just want to say nice and be done with it, yaknow?`,
		`people keep telling me it's weird i watch you read? anyways nice completion!`,
		`when's the last time you did the macarena? just a thought. nice one!`,
		`when's the last time you square danced? just a thought. nice one!`,
		`nice! don't go too hard celebrating this completion! 🎉`,
		`hmmm. very interesting part of the book. hmmm yes. indeed.`,
		`is it just me or is it hotter in here since you completed the interval? 🥵`,
		`SLUG BUG! trust me, i saw it right out my window. anyways nice completion!`,
		`go reader! go reader! goooooo reader! 👏`,
		`niiiiiiiiiiiiiiiiiiiiiiiice`,
	]
	const handleClick = () => {
		if (setClicked && setIsComplete) {
			setClicked(true)
			clicked && setIsComplete(!isComplete)
			if (!isComplete || !clicked) {
				toast.success(choices[Math.floor(Math.random() * choices.length)])
			}
		} else if (setIsComplete) {
			setIsComplete(!isComplete)
			if (!isComplete) {
				toast.success(choices[Math.floor(Math.random() * choices.length)])
			}
		}
	}

	return (
		<Tooltip>
			<TooltipTrigger>
				<motion.div
					className="w-16 md:w-24 h-16 md:h-24 p-0 rounded-full text-primary"
					onClick={() => handleClick()}
					initial={{
						scale: 1.1,
					}}
					animate={{
						scale: 1,
					}}
				>
					{isComplete ? (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="currentColor"
							className="w-16 md:w-24 h-16 md:h-24"
						>
							<path
								fillRule="evenodd"
								d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
								clipRule="evenodd"
							/>
						</svg>
					) : (
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="w-16 md:w-24 h-16 md:h-24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
							/>
						</svg>
					)}
				</motion.div>
			</TooltipTrigger>
			<TooltipContent>
				<p>{isComplete ? "un-complete reading" : "complete reading"}</p>
			</TooltipContent>
		</Tooltip>
	)
}
