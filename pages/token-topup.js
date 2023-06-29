import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AppLayout } from '../components/AppLayout'
import { getAppProps } from '../utils/getAppProps'

export default function TokenTopup() {
	const handleClick = async () => {
		const response = await fetch(`/api/addTokens`, {
			method: 'POST',
		})

		const data = await response.json()
		console.log(data)
		window.location.href = data.session.url
	}

	return (
		<div className='bg-slate-100'>
			<div className=' w-full h-full flex flex-col overflow-auto max-w-screen-sm items-center justify-center mx-auto'>
				<h1>Token Top Up</h1>
				<p className='font-bold text-red-500'>
					You must have at least one token to fetch the post!
				</p>
				<button className='btn' onClick={handleClick}>
					Add tokens
				</button>
			</div>
		</div>
	)
}

TokenTopup.getLayout = function getLayout(page, pageProps) {
	return <AppLayout {...pageProps}>{page}</AppLayout>
}

export const getServerSideProps = withPageAuthRequired({
	async getServerSideProps(ctx) {
		const props = await getAppProps(ctx)
		return { props }
	},
})
