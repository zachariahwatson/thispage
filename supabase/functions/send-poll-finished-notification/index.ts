// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from "jsr:@supabase/supabase-js@2"
import { Database } from "types"

type PollRecord = Database["public"]["Tables"]["polls"]["Row"]

Deno.serve(async (req) => {
	try {
		const payload: PollRecord = await req.json()

		const supabase = createClient(Deno.env.get("SUPABASE_URL") ?? "", Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "", {
			global: { headers: { Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}` } },
		})

		//query
		const { data: members, error: membersError } = await supabase
			.from("members")
			.select(
				`id,
				user_id
				`
			)
			.eq("club_id", payload.club_id)

		if (membersError) {
			throw membersError
		}

		const userIDs = members?.map((member: { id: number; user_id: string }) => member?.user_id) || []

		// Fetch user data for each user_id and store in emails array
		const emails = await Promise.all(
			userIDs.map(async (user_id: string) => {
				const { data, error } = await supabase.auth.admin.getUserById(user_id)
				if (error) {
					throw error
				}
				return data?.user?.email
			})
		)

		//get necessary data for email body
		const { data: pollData, error: pollDataError } = await supabase
			.from("polls")
			.select(
				`
          name,
				  ...clubs (
            club_name:name
          )
				`
			)
			.eq("id", payload.id)
			.single()

		if (pollDataError) {
			throw pollDataError
		}

		// Get necessary data for email body
		const { data: emailData, error: emailDataError } = await supabase
			.from("poll_items")
			.select(
				`poll_id,
        		poll_votes(count),
        		book_title
        		`
			)
			.eq("poll_id", payload.id)

		emailData?.sort((a, b) => b.poll_votes[0].count - a.poll_votes[0].count)

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
					subject: "poll finished!",
					html: `
			  <div>
			    <p>hey!</p>
			    <p>
			      the poll titled <strong>${pollData.name}</strong> in ${
						pollData.club_name
					} is finished! these items received the most votes:
			    </p>
				<ol>
				${emailData
					.slice(0, 3)
					.map(
						(item) =>
							`<li><strong>${item.book_title}</strong> with ${item.poll_votes[0].count} ${
								item.poll_votes[0].count < 2 ? "vote" : "votes"
							}</li>`
					)
					.join("")}
				</ol>
			    <p style="margin:0px;">sincerely,</p>
			    <a style="margin:0px;" href="https://thispa.ge">this<strong>page</strong></p>
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

/* 
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-poll-finished-notification'
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'
--header 'Content-Type: application/json'
--data '{"club_id":10,"created_at":"2024-09-11 04:57:50.63099+00","end_date":"2024-09-25 04:59:17+00","creator_member_id":12,"id":47,"is_locked":false,"name":"test poll","description":null,"status":"voting","editor_member_id":12,"voting_length_days":7}'
*/
