"use client"

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	Separator,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/"
import { useEffect, useState } from "react"
import { version } from "@/lib/version"
import Link from "next/link"

function trimVersion(version: string) {
	const parts = version.split(".")
	parts.pop()
	return parts.join(".")
}

export function WhatsNewDialog() {
	const [visible, setVisible] = useState<boolean>(false)
	useEffect(() => {
		if (localStorage.getItem("whats-new") !== trimVersion(version)) {
			setVisible(true)
			localStorage.setItem("whats-new", trimVersion(version))
		}
	}, [])
	return (
		<Dialog open={visible} onOpenChange={setVisible}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-3xl">what's new?</DialogTitle>
				</DialogHeader>
				<Tabs defaultValue="1.1.0">
					<TabsList>
						<TabsTrigger value="1.1.0">1.1.0</TabsTrigger>
						<TabsTrigger value="1.0.0">1.0.0</TabsTrigger>
						<TabsTrigger value="0.10.0">0.10.0</TabsTrigger>
						{/* <TabsTrigger value="0.9.0">0.9.0</TabsTrigger> */}
						{/* <TabsTrigger value="0.8.0">0.8.0</TabsTrigger> */}
						{/* <TabsTrigger value="0.7.0">0.7.0</TabsTrigger> */}
					</TabsList>
					<Separator className="my-4" />
					<TabsContent value="1.1.0" className="space-y-3">
						<DialogTitle>likes list</DialogTitle>
						<div className="pl-4">
							<DialogDescription>
								- you can now see who has liked your posts and comments! just click on the number next to the like
								button. go ahead. check your likes every 10 minutes.
							</DialogDescription>
						</div>
						<DialogTitle>custom avatar urls</DialogTitle>
						<div className="pl-4">
							<DialogDescription>
								- personalize your vibezzz! head to the user settings to try it out. (only urls because I don't want to
								mess with storing images so deal with it)
							</DialogDescription>
						</div>
						<DialogTitle>so many tweaks and quality of life changes</DialogTitle>
						<div className="pl-4">
							<DialogDescription>- i'd need a few hours to list them all, trust me.</DialogDescription>
						</div>
					</TabsContent>
					<TabsContent value="1.0.0" className="space-y-3">
						{/* <DialogTitle>archive section</DialogTitle>
						<div className="pl-4">
							<DialogDescription>
								- view your archived readings and polls. reminisce on old times. let out a happy sigh.
							</DialogDescription>
						</div> */}
						<DialogTitle>themes</DialogTitle>
						<div className="pl-4">
							<DialogDescription>
								- prettier themes with more to come soon(tm)! check out the{" "}
								<Link href="/themes" className="underline text-primary" target="_blank" rel="noopener noreferrer">
									theme tool
								</Link>{" "}
								to play around with your own! (currently there's no way to save them, but hit me up if you make a cool
								one!)
							</DialogDescription>
						</div>
						<DialogTitle>password reset flow</DialogTitle>
						<div className="pl-4">
							<DialogDescription>
								- you can now reset your password through the login page! yeah you've totally been able to do that this
								whole time. TOTALLY.
							</DialogDescription>
						</div>
						<DialogTitle>even more notification emails</DialogTitle>
						<div className="pl-4">
							<DialogDescription>- added notifications for polls ending and finishing.</DialogDescription>
						</div>
					</TabsContent>
					<TabsContent value="0.10.0" className="space-y-3">
						<DialogTitle>polls v2</DialogTitle>
						<div className="pl-4">
							<DialogDescription>
								- polls have been reworked to adhere to the{" "}
								<Link
									href="https://en.wikipedia.org/wiki/Approval_voting"
									className="underline text-primary"
									target="_blank"
									rel="noopener noreferrer"
								>
									approval voting system
								</Link>
								. members can now vote for multiple books that they would be okay with reading. items are also shuffled
								to mitigate the serial-position effect.
							</DialogDescription>
						</div>
						<DialogTitle>more notification emails</DialogTitle>
						<div className="pl-4">
							<DialogDescription>
								- added notifications for new polls, readings, and poll status updates.
							</DialogDescription>
						</div>
						<DialogTitle>human-friendly errors</DialogTitle>
						<div className="pl-4">
							<DialogDescription>- errors are now more verbose with error codes.</DialogDescription>
						</div>
						<DialogTitle>book search sort</DialogTitle>
						<div className="pl-4">
							<DialogDescription>- you can now sort by publication date in the book search.</DialogDescription>
						</div>
						<DialogTitle>favorite button</DialogTitle>
						<div className="pl-4">
							<DialogDescription>- put the clubs that you frequent most at the top of your list!</DialogDescription>
						</div>
					</TabsContent>
					{/* <TabsContent value="0.9.0" className="space-y-3">
						<DialogTitle>polls</DialogTitle>
						<div className="pl-4">
							<DialogDescription>
								- admins can create polls to decide what book to read next, locking at a specified end date. yes, there
								is a mini book podium for the winners. duh.
							</DialogDescription>
						</div>
						<DialogTitle>filter books by language</DialogTitle>
						<div className="pl-4">
							<DialogDescription>
								- filter books by (literally) every language when creating a reading or poll item!
							</DialogDescription>
						</div>
						<DialogTitle>book club tabs</DialogTitle>
						<div className="pl-4">
							<DialogDescription>
								- there are now tabs at the bottom of every book club for easy pagination.
							</DialogDescription>
						</div>
					</TabsContent> */}
					{/* <TabsContent value="0.8.0" className="space-y-3">
						<DialogTitle>email notifications</DialogTitle>
						<div className="pl-4">
							<DialogDescription>
								- once a reading goal is completed, readers will receive an email notifying them of the completion. no
								more nagging at your members to read the goal!
							</DialogDescription>
						</div>
					</TabsContent> */}
					{/* <TabsContent value="0.7.0" className="space-y-3">
						<DialogTitle>read books by custom sections instead of pages</DialogTitle>
						<div className="pl-4">
							<DialogDescription>
								- admins now have the ability to create readings that increment by custom sections such as chapters,
								stories, parts, etc.
							</DialogDescription>
						</div>
						<DialogTitle>custom cover urls</DialogTitle>
						<div className="pl-4">
							<DialogDescription>- admins can change the reading's cover to any image link.</DialogDescription>
						</div>
					</TabsContent> */}
				</Tabs>

				<div className="mt-4">
					<p>love,</p>
					<p className="font-epilogue">
						<span className="font-normal">this</span>
						<span className="font-bold">page</span>
					</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}
