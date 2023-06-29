import { getSession } from '@auth0/nextjs-auth0'
import clientPromise from '../lib/mongodb'

/**
 * A helper function to get all the needed props
 */
export const getAppProps = async (ctx) => {
	const { user } = await getSession(ctx.req, ctx.res)
	const client = await clientPromise
	const db = await client.db('blogpostai')

	const existedUser = await db.collection('users').findOne({
		auth0Id: user.sub,
	})

	if (!existedUser) {
		return {
			availableTokens: 0,
			posts: [],
		}
	}

	const posts = await db
		.collection('posts')
		.find({
			userId: existedUser._id,
		})
		.sort({ created: -1 })
		.toArray()

	return {
		availableTokens: existedUser.availableTokens,
		posts: posts.map(({ created, _id, userId, ...rest }) => {
			return {
				_id: _id.toString(),
				created: created.toString(),
				...rest,
			}
		}),
		postId: ctx.params?.postId || null,
	}
}
