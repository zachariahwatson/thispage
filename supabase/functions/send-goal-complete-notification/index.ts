// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from "jsr:@supabase/supabase-js@2"
import { Database } from "./types.ts"

type IntervalRecord = Database["public"]["Tables"]["intervals"]["Row"]

interface WebHookPayload {
	type: "INSERT" | "UPDATE" | "DELETE"
	table: string
	record: IntervalRecord
	schema: "public"
	old_record: IntervalRecord | null
}

Deno.serve(async (req) => {
	try {
		const payload: WebHookPayload = await req.json()

		if (
			(payload.old_record?.is_complete === false || payload.old_record?.is_complete === null) &&
			payload.record.is_complete === true &&
			payload.type === "UPDATE"
		) {
			const supabase = createClient(
				Deno.env.get("SUPABASE_URL") ?? "",
				Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
				{
					global: { headers: { Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` } },
				}
			)

			//query
			const { data: memberIntervalProgresses, error: memberIntervalProgressesError } = await supabase
				.from("member_interval_progresses")
				.select(
					`
				...members (
						user_id
					)
				`
				)
				.eq("interval_id", payload.record.id)
				.order("updated_at", { ascending: true }) //get most recent updated_at, aka the last member to complete the reading

			// Remove the most recent member interval so they don't receive the email
			memberIntervalProgresses?.pop()

			const userIDs = memberIntervalProgresses?.map((member) => member?.user_id) || []

			// Fetch user data for each user_id and store in emails array
			const emails = await Promise.all(
				userIDs.map(async (user_id) => {
					const { data, error } = await supabase.auth.admin.getUserById(user_id)
					if (error) {
						throw error
					}
					return data?.user?.email
				})
			)

			if (memberIntervalProgressesError) {
				throw memberIntervalProgressesError
			}

			//get necessary data for email body
			const { data: emailData, error: emailDataError } = await supabase
				.from("intervals")
				.select(
					`
				goal_page,
        goal_section,
        ...readings (
          book_title,
          increment_type,
          section_name,
          ...clubs (
            club_name:name
          )
        )
				`
				)
				.eq("id", payload.record.id)
				.single()

			if (emailDataError) {
				throw emailDataError
			}

			//if there are emails in the array
			if (emails.length > 0) {
				const res = await fetch("https://api.resend.com/emails", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
					},
					body: JSON.stringify({
						from: "thispage <notifications@thispa.ge>",
						to: emails,
						subject: "reading goal completed!",
						html: `
          <div>
            <p>hey!</p>
            <p>
              all readers have read ${emailData.book_title} to ${
							emailData.increment_type === "pages" ? "page" : emailData.section_name
						} ${emailData.increment_type === "pages" ? emailData.goal_page : emailData.goal_section} in ${
							emailData.club_name
						}. now's the time to discuss what you thought!
            </p>
            <p>love,</p>
            <p>thispage</p>
          </div>
        `,
					}),
				})

				const data = await res.json()

				return new Response(JSON.stringify(data), {
					status: 200,
					headers: {
						"Content-Type": "application/json",
					},
				})
			}
		}

		return new Response(null, {
			status: 200,
			headers: {
				"Content-Type": "application/json",
			},
		})
	} catch (err) {
		return new Response(String(err?.message ?? err), { status: 500 })
	}
})
