/**
 * ! Executing this script will delete all data in your database and seed it with 10 users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed"

const main = async () => {
	const seed = await createSeedClient()

	// Truncate all tables in the database
	await seed.$resetDatabase()

	await seed.users((x) =>
		x({ min: 10, max: 25 }, (ctx) => ({
			raw_user_meta_data: {
				avatar_url: `https://picsum.photos/200?random=${ctx.index}`,
			},
		}))
	)

	await seed.profiles((x) => x({ min: 10, max: 25 }))

	await seed.clubs((x) => x(5))

	await seed.members((x) => x({ min: 25, max: 50 }))

	await seed.books((x) =>
		x({ min: 10, max: 25 }, (ctx) => ({
			olid: `${ctx.index}`,
			image_width: 200,
			image_height: 300,
			image_url: `https://picsum.photos/200/300?random=${ctx.index}`,
		}))
	)

	await seed.readings((x) => x({ min: 10, max: 25 }))

	await seed.intervals((x) => x({ min: 25, max: 75 }))

	await seed.posts((x) => x({ min: 25, max: 75 }))

	console.log("Database seeded successfully!")

	process.exit()
}

main()
