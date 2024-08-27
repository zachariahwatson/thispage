"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { Separator } from "./separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs"

const version = "0.8.0"

export function WhatsNewDialog() {
	const [visible, setVisible] = useState<boolean>(false)
	useEffect(() => {
		if (localStorage.getItem("whats-new") !== version) {
			setVisible(true)
			localStorage.setItem("whats-new", version)
		}
	}, [])
	return (
		<Dialog open={visible} onOpenChange={setVisible}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-3xl">what's new?</DialogTitle>
				</DialogHeader>
				<Tabs defaultValue="0.8.0">
					<TabsList>
						<TabsTrigger value="0.8.0">0.8.0</TabsTrigger>
						<TabsTrigger value="0.7.0">0.7.0</TabsTrigger>
					</TabsList>
					<Separator className="my-4" />
					<TabsContent value="0.8.0" className="space-y-3">
						<DialogTitle>email notifications</DialogTitle>
						<div className="pl-4">
							<DialogDescription>
								- once a reading goal is completed, readers will receive an email notifying them of the completion. no
								more nagging at your members to read the goal!
							</DialogDescription>
						</div>
					</TabsContent>
					<TabsContent value="0.7.0" className="space-y-3">
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
					</TabsContent>
				</Tabs>

				<div className="mt-4">
					<p>love,</p>
					<p>
						<span className="font-normal">this</span>
						<span className="font-bold">page</span>
					</p>
				</div>
			</DialogContent>
		</Dialog>
	)
}
