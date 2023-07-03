import { getSession, withPageAuthRequired } from '@auth0/nextjs-auth0'
import { getAppProps } from '../../utils/getAppProps'
import { AppLayout } from '../../components/AppLayout'
import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHashtag } from '@fortawesome/free-solid-svg-icons'
import { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import { PostsContext } from '../../context/postContext'

export default function Post(props) {
	const router = useRouter()
	const { deletePost } = useContext(PostsContext)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

	const handleDeletePost = async () => {
		try {
			const response = await fetch('/api/deletePost', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(props.postId),
			})

			const data = await response.json()
			if (data.success) {
				deletePost(props.postId)
				router.replace('/post/new')
			}
		} catch (error) {}
	}

	return (
		<div className='overflow-auto h-full'>
			<div className='max-w-screen-sm mx-auto'>
				<div className='text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm'>
					SEO Title and Meta Description
				</div>
				<div className='p-4 my-2 border border-stone-200 rounded-md'>
					<div className='text-blue-600 text-2xl font-bold'>
						{props.title}
					</div>
					<div className='mt-2'>{props.metaDescription}</div>
				</div>
				<div className='text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm'>
					Keywords
				</div>
				<div className='flex flex-wrap pt-2 gap-1'>
					{props.keywords.split(',').map((keyword, i) => (
						<div
							key={i}
							className='p-2 rounded-full bg-slate-800 text-white'
						>
							<FontAwesomeIcon icon={faHashtag} /> {keyword}
						</div>
					))}
				</div>
				<div className='text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm'>
					Blog Post
				</div>
				<div
					dangerouslySetInnerHTML={{
						__html: props.postContent || '',
					}}
				/>
				{!showDeleteConfirm && (
					<div className='my-4'>
						<button
							onClick={() => setShowDeleteConfirm(true)}
							className='btn bg-red-600 hover:bg-red-700'
						>
							Delete Post
						</button>
					</div>
				)}
				{showDeleteConfirm && (
					<div className='my-4'>
						<p className='p-2 bg-red-300 text-center text-bold'>
							Are you sure you want to delete this post? This
							action is irreversible
						</p>
						<div className='grid grid-cols-2 gap-2'>
							<button
								className='btn bg-red-600 hover:bg-red-700'
								onClick={handleDeletePost}
							>
								Confirm Delete
							</button>
							<button
								onClick={() => setShowDeleteConfirm(false)}
								className='btn bg-stone-600 hover:bg-stone-700'
							>
								Cancel
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

Post.getLayout = function getLayout(page, pageProps) {
	return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps(ctx) {
		const props = await getAppProps(ctx)
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
					postId: ctx.params.postId,
					postContent: post.postContent,
					title: post.title,
					metaDescription: post.metaDescription,
					keywords: post.keywords,
					postCreated: post.created.toString(),
					...props,
				},
			}
		} catch (error) {
			console.log(error)
		}
	},
})
