/**
 * ! Executing this script will delete all data in your database and seed it with 10 users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */
import { createSeedClient } from "@snaplet/seed"

const main = async () => {
	const seed = await createSeedClient({ dryRun: true })

	// Truncate all tables in the database
	await seed.$resetDatabase()

	const { users } = await seed.users((x) =>
		x({ min: 10, max: 25 }, (ctx) => ({
			raw_user_meta_data: {
				avatar_url: `https://picsum.photos/200?random=${ctx.index}`,
			},
		}))
	)

	const { profiles } = await seed.profiles((x) => x({ min: 10, max: 25 }), { connect: { users } })

	const { clubs } = await seed.clubs((x) => x({ min: 5, max: 10 }))

	await seed.club_invite_codes((x) => x(5), { connect: { clubs } })

	const memberCount = Math.floor(Math.random() * 25) + 25

	const { members } = await seed.members((x) => x(memberCount), { connect: { profiles, clubs } })

	await seed.member_roles((x) => x(memberCount), { connect: { members } })

	const { books } = await seed.books(
		(x) =>
			x({ min: 10, max: 25 }, (ctx) => ({
				image_width: 200,
				image_height: 300,
				image_url: `https://picsum.photos/200/300?random=${ctx.index}`,
				page_count: Math.floor(Math.random() * 800) + 200,
			})),
		{ connect: { members } }
	)

	const { readings } = await seed.readings(
		(x) =>
			x({ min: 10, max: 25 }, (ctx) => ({
				current_page: 100 + Math.floor(Math.random() * 100),
				is_current: Math.random() < 0.9,
			})),
		{ connect: { books, clubs } }
	)

	await seed.intervals(
		(x) =>
			x({ min: 25, max: 75 }, (ctx) => ({
				is_completed: Math.random() < 0.3,
				is_current: Math.random() < 0.7,
			})),
		{ connect: { members, readings } }
	)

	const { posts } = await seed.posts(
		(x) =>
			x({ min: 25, max: 75 }, (ctx) => ({
				likes: Math.floor(Math.random() * 10),
				is_spoiler: Math.random() < 0.3,
			})),
		{ connect: { members, readings } }
	)

	const { comments } = await seed.comments(
		(x) =>
			x({ min: 50, max: 150 }, (ctx) => ({
				likes: Math.floor(Math.random() * 10),
			})),
		{ connect: { members, posts } }
	)

	await seed.comments(
		(x) =>
			x({ min: 50, max: 150 }, (ctx) => ({
				likes: Math.floor(Math.random() * 10),
			})),
		{ connect: { members, posts, comments } }
	)

	//console.log("Database seeded successfully!")

	process.exit()
}

main()
