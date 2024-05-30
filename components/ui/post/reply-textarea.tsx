import { Dispatch, SetStateAction } from "react"
import { Button } from "../buttons"
import { Textarea } from "../textarea"

interface Props {
	setReplyBoxVisible: Dispatch<SetStateAction<boolean>>
}

export function ReplyTextArea({ setReplyBoxVisible }: Props) {
	return (
		<div className="space-y-2 max-w-96 w-full relative">
			<Textarea className="mb-4" placeholder="type your reply here" />
			<div className="absolute bottom-6 right-2 space-x-1">
				<Button size="sm" variant="secondary" onClick={() => setReplyBoxVisible(false)}>
					cancel
				</Button>
				<Button size="sm">reply</Button>
			</div>
		</div>
	)
}
