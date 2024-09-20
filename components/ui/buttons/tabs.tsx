"use client"

import { Label, RadioGroup, RadioGroupItem } from "@/components/ui"
import { useClubMembership } from "@/contexts"
import { useEffect, useState } from "react"

interface Props {
	spreadsCount:
		| {
				club_id: number | null
				total_polls: number | null
				total_readings: number | null
				total_spreads: number | null
		  }
		| undefined
	userSpreadIndex: number
	setUserSpreadIndex: React.Dispatch<React.SetStateAction<number>>
}

export function Tabs({ spreadsCount, userSpreadIndex, setUserSpreadIndex }: Props) {
	const clubMembership = useClubMembership()
	const [value, setValue] = useState<string>()

	const handleValue = (newValue: string) => {
		localStorage.setItem(`club-${clubMembership?.club.id}-member-${clubMembership?.id}-tab-index`, newValue)
		setUserSpreadIndex(Number(newValue))
		setValue(newValue)
	}

	useEffect(() => {
		if (spreadsCount?.total_readings && spreadsCount?.total_readings > 0 && userSpreadIndex === 0) {
			setValue("0")
		}

		if (
			spreadsCount?.total_polls &&
			spreadsCount?.total_polls > 0 &&
			userSpreadIndex === (spreadsCount?.total_readings ?? 0)
		) {
			setValue((spreadsCount?.total_readings ?? 0).toString())
		}

		if (
			spreadsCount?.total_spreads &&
			clubMembership?.role === "admin" &&
			userSpreadIndex === spreadsCount?.total_spreads - 1
		) {
			setValue((spreadsCount?.total_spreads - 1).toString())
		}
	}, [userSpreadIndex, spreadsCount])

	return (
		<RadioGroup
			className="flex flex-row justify-center md:pl-[calc(50%)]"
			value={value}
			onValueChange={handleValue}
			key={clubMembership?.club.id}
		>
			{spreadsCount?.total_readings && spreadsCount?.total_readings > 0 ? (
				<Bookmark id={`${clubMembership?.club.id} 0`} value={"0"} groupValue={value}>
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
							d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
						/>
					</svg>
				</Bookmark>
			) : null}
			{spreadsCount?.total_polls && spreadsCount?.total_polls > 0 ? (
				<Bookmark
					id={`${clubMembership?.club.id} ${(spreadsCount?.total_readings ?? 0).toString()}`}
					value={(spreadsCount?.total_readings ?? 0).toString()}
					groupValue={value}
				>
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
							d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
						/>
					</svg>
				</Bookmark>
			) : null}
			{spreadsCount?.total_spreads && clubMembership?.role === "admin" ? (
				<Bookmark
					id={`${clubMembership?.club.id} ${(spreadsCount?.total_spreads - 1).toString()}`}
					value={(spreadsCount?.total_spreads - 1).toString()}
					groupValue={value}
				>
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
							d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
						/>
					</svg>
				</Bookmark>
			) : null}
		</RadioGroup>
	)
}

interface BookmarkProps {
	id: string
	value: string
	className?: string
	children: React.ReactNode
	groupValue: string | undefined
}

function Bookmark({ id, value, className, children, groupValue }: BookmarkProps) {
	const isSelected = value === groupValue
	// const radius = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--radius"))
	const radius = 0

	// const path = `M 0 -1 H 24 C ${23} ${6} ${27} 4 12 1 C ${-3} 4 ${1} ${6} 0 -1 Z`
	const path = `M 0 -1 H 24 C ${24 - radius} ${4 + radius * 2} ${24 + radius * 3} 4 12 1 C ${radius * -3} 4 ${radius} ${
		4 + radius * 2
	} 0 -1 Z`

	return (
		<div
			className={`bg-page-fold w-16 drop-shadow-md ${
				isSelected ? "h-12 shadow-xl shadow-ring/50" : "h-10 shadow-shadow"
			} hover:h-12 transition-all ${className} border rounded-b-lg`}
		>
			<RadioGroupItem value={value} id={id} hidden />
			<Label
				htmlFor={id}
				className={`w-full h-full flex items-end justify-center pb-2 hover:cursor-pointer ${
					isSelected ? "text-ring" : "text-muted-foreground"
				}`}
			>
				{children}
			</Label>
			{/* <svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 24 24"
				strokeWidth=".5"
				className="size-16 stroke-border fill-page-fold -mx-[1px]"
			>
				<path fillRule="evenodd" d={path} clipRule="evenodd" />
			</svg> */}
		</div>
	)
}
