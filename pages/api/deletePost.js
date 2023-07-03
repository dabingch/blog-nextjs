import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0'
import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default withApiAuthRequired(async function handler(req, res) {
	try {
		const { user } = await getSession(req, res)
		const client = await clientPromise
		const db = client.db('blogpostai')

		const existedUser = await db.collection('users').findOne({
			auth0Id: user.sub,
		})

		if (!existedUser) {
			res.status(403).json({ error: 'User not found' })
			return
		}

		const { postId } = req.body

		await db.collection('posts').deleteOne({
			userId: existedUser._id,
			_id: new ObjectId(postId),
		})

		res.status(200).json({ success: true })
		return
	} catch (error) {
		console.log('ERROR IN DELETE POST API: ', error)
	}
})
