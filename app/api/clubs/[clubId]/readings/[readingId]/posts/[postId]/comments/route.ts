import { createClient } from "@/utils/supabase/server"
import { CommentType, UnstructuredCommentType } from "@/utils/types"
import { NextRequest } from "next/server"

interface Props {
	params: {
		clubId: string
		readingId: string
		postId: string
	}
}

/**
 * gets the specified post's comments. rls ensures that the authenticated user is a member of the reading.
 */
export async function GET(request: NextRequest, { params }: Props) {
	try {
		const supabase = createClient()

		//query (gets comments at the root along with their child comments. right now it works like tiktok where there's only one sublevel where child comments have an anchor link to other child comments)
		const { data, error } = await supabase
			.from("comments")
			.select(
				`
                id,
                content,
                likes,
                created_at,
                updated_at,
                members(
                    profiles(
                        id,
                        name,
                        first_name,
                        last_name,
                        avatar_url
                    )
                ),
                comments!root_comment_id(
                    id,
                    content,
                    likes,
                    created_at,
                    updated_at,
                    members(
                        profiles(
                            id,
                            name,
                            first_name,
                            last_name,
                            avatar_url
                        )
                    ),
					comments:parent_comment_id(
						id,
						members(
							profiles(
								id,
								name,
								first_name,
								last_name,
								avatar_url
							)
						)
					)
                )`
			)
			.eq("parent_post_id", params.postId)
			.is("root_comment_id", null)

		if (error) {
			console.error("error getting post's comments: " + JSON.stringify(error))
			throw new Error(error.message)
		}

		//structure data for better mutability
		const structuredData: CommentType[] =
			//have to do some weird typecasting here
			(data as any)?.map((comment: UnstructuredCommentType) => {
				return {
					id: comment.id,
					content: comment.content,
					likes: comment.likes,
					createdAt: new Date(comment.created_at),
					updatedAt: new Date(comment.updated_at),
					member: {
						profile: {
							id: comment.members.profiles.id,
							name: comment.members.profiles.name,
							firstName: comment.members.profiles.first_name,
							lastName: comment.members.profiles.last_name,
							avatarUrl: comment.members.profiles.avatar_url,
						},
					},
					subComments:
						comment.comments.map((subcomment) => ({
							id: subcomment.id,
							content: subcomment.content,
							likes: subcomment.likes,
							createdAt: new Date(subcomment.created_at),
							updatedAt: new Date(subcomment.updated_at),
							member: {
								profile: {
									id: subcomment.members.profiles.id,
									name: subcomment.members.profiles.name,
									firstName: subcomment.members.profiles.first_name,
									lastName: subcomment.members.profiles.last_name,
									avatarUrl: subcomment.members.profiles.avatar_url,
								},
							},
							parentComment: subcomment.comments
								? {
										id: subcomment.comments.id,
										member: {
											profile: {
												id: subcomment.comments.members.profiles.id,
												name: subcomment.comments.members.profiles.name,
												firstName: subcomment.comments.members.profiles.first_name,
												lastName: subcomment.comments.members.profiles.last_name,
												avatarUrl: subcomment.comments.members.profiles.avatar_url,
											},
										},
								  }
								: null,
						})) || [],
				}
			}) || []
		return Response.json(structuredData, { status: 200 })
	} catch (error) {
		console.error(error)
		return Response.json({ error: "an error occurred while fetching the post's comments" }, { status: 500 })
	}
}
