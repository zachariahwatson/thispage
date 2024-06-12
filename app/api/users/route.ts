import { createClient } from "@/utils/supabase/server"
import { NextRequest } from "next/server"
import { revalidatePath } from "next/cache"

/**
 * gets the current logged in user.
 */
export async function GET(request: NextRequest) {
	try {
		const supabase = createClient()

		const {
			data: { user },
		} = await supabase.auth.getUser()

		if (user) {
			//query
			const { data, error } = await supabase.from("users").select("*").eq("id", user?.id).single()
			if (error) {
				throw error
			}
			return Response.json(data, { status: 200 })
		}

		return Response.json(null, { status: 200 })
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while fetching user:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while fetching user." }, { status: 500 })
	}
}

/**
 * updates the current user.
 */
export async function PATCH(request: NextRequest) {
	try {
		const supabase = createClient()

		const body = await request.json()

		const {
			data: { user },
		} = await supabase.auth.getUser()

		if (user) {
			//query
			const { error } = await supabase
				.from("users")
				.update({
					first_name: body.first_name,
					last_name: body.last_name,
					name: body.first_name + " " + body.last_name,
				})
				.eq("id", user?.id)
			if (error) {
				throw error
			}
			revalidatePath("/", "layout")
			return Response.json({ message: "successfully updated user" }, { status: 200 })
		}

		return Response.json(null, { status: 200 })
	} catch (error) {
		console.error(
			"\x1b[31m%s\x1b[0m",
			"\nan error occurred while updating user:\n" + JSON.stringify(error, null, 2) + "\n"
		)
		return Response.json({ error: "an error occurred while updating user." }, { status: 500 })
	}
}
