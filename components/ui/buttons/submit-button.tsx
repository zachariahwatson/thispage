"use client"

import { Button } from "@/components/ui/buttons"
import { type ComponentProps } from "react"
import { useFormStatus } from "react-dom"

type Props = ComponentProps<typeof Button> & {
	pendingText?: string
}

export function SubmitButton({ children, pendingText, ...props }: Props) {
	const { pending, action } = useFormStatus()

	const isPending = pending && action === props.formAction

	return (
		<Button {...props} type="submit" aria-disabled={pending}>
			{isPending ? pendingText : children}
		</Button>
	)
}
