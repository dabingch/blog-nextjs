import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { getAppProps } from '../../utils/getAppProps'
import { AppLayout } from '../../components/AppLayout'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBrain } from '@fortawesome/free-solid-svg-icons'

export default function NewPost({}) {
	const router = useRouter()

	const [topic, setTopic] = useState('')
	const [keywords, setKeywords] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const handleSubmit = async (e) => {
		e.preventDefault()

		setIsLoading(true)

		try {
			const response = await fetch('/api/generatePost', {
				method: 'POST',
				headers: {
					'content-type': 'application/json',
				},
				body: JSON.stringify({ topic, keywords }),
			})

			const data = await response.json()
			if (data?.postId) {
				router.push(`/post/${data.postId}`)
			}
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false)
			setTopic('')
			setKeywords('')
		}
	}

	return (
		<div className='h-full overflow-hidden '>
			{isLoading ? (
				<div className='text-green-500 flex flex-col justify-center items-center w-full h-full animate-pulse'>
					<FontAwesomeIcon icon={faBrain} className='text-8xl' />
					<h6>Generating...</h6>
				</div>
			) : (
				<div className='w-full h-full flex flex-col overflow-auto'>
					<form
						onSubmit={handleSubmit}
						className='m-auto w-full max-w-screen-sm bg-slate-100 p-4 rounded-md shadow-xl border border-slate-200 shadow-slate-200'
					>
						<div>
							<label>
								<strong>
									Generate a blog post on the topic of:
								</strong>
							</label>
							<textarea
								className='resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm'
								value={topic}
								onChange={(e) => setTopic(e.target.value)}
								maxLength={80}
							/>
						</div>
						<div>
							<label>
								<strong>
									Targeting the following keywords:
								</strong>
							</label>
							<textarea
								className='resize-none border border-slate-500 w-full block my-2 px-4 py-2 rounded-sm'
								value={keywords}
								onChange={(e) => setKeywords(e.target.value)}
								maxLength={80}
							/>
							<small className='block mb-2 font-bold'>
								Separate keywords with comma
							</small>
						</div>
						<button
							disabled={!topic.trim() || !keywords.trim()}
							type='submit'
							className='btn'
						>
							Generate
						</button>
					</form>
				</div>
			)}
		</div>
	)
}

NewPost.getLayout = function getLayout(page, pageProps) {
	return <AppLayout {...pageProps}>{page}</AppLayout>
}

// props for the component in SSR
export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps(ctx) {
		const props = await getAppProps(ctx)

		if (!props.availableTokens) {
			return {
				redirect: {
					destination: '/token-topup',
					permanent: false,
				},
			}
		}

		return { props }
	},
})
