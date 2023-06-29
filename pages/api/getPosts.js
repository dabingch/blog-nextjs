import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import clientPromise from '../../lib/mongodb'

export default withApiAuthRequired(async function handler(req, res) {
	try {
		const { user } = await getSession(req, res)
		const client = await clientPromise
		const db = await client.db('blogpostai')

		const existedUser = await db
			.collection('users')
			.findOne({ auth0Id: user.sub })

		const { lastPostDate } = req.body

		const posts = await db
			.collection('posts')
			.find({
				userId: existedUser._id,
				created: { $lt: new Date(lastPostDate) },
			})
			.limit(Number(process.env.POST_LIMIT) || 2)
			.sort({ created: -1 })
			.toArray()

		res.status(200).json(posts)
	} catch (error) {
		console.log(error)
	}
})
