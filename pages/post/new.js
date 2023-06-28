import { withPageAuthRequired } from '@auth0/nextjs-auth0'
import { AppLayout } from '../../components/AppLayout'

export default function NewPost({}) {
	return <div>new post page</div>
}

NewPost.getLayout = function getLayout(page, pageProps) {
	return <AppLayout {...pageProps}>{page}</AppLayout>
}

// props for the component in SSR
export const getServerSideProps = withPageAuthRequired(() => {
	return {
		props: {},
	}
})
