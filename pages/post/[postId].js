import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AppLayout } from '../../components/AppLayout'
import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default function Post(props) {
	return <div>post page</div>
}

Post.getLayout = function getLayout(page, pageProps) {
	return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps(ctx) {
		const { user } = await getSession(ctx.req, ctx.res)
		const client = await clientPromise
		const db = client.db('blogpostai')

		const existedUser = await db.collection('users').findOne({
			auth0Id: user.sub,
		})

		try {
			const post = await db.collection('posts').findOne({
				_id: new ObjectId(ctx.params.postId),
				userId: existedUser._id,
			})

			if (!post) {
				return {
					redirect: {
						destination: '/post/new',
						permanent: false,
					},
				}
			}

			return {
				props: {
					postContent: post.postContent,
					title: post.title,
					metaDescription: post.metaDescription,
					keywords: post.keywords,
				},
			}
		} catch (error) {
			console.log(error)
		}
	},
})
