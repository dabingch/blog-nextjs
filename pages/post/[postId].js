import { withPageAuthRequired } from '@auth0/nextjs-auth0'

export default function Post() {
	return <div>post page</div>
}

export const getServerSideProps = withPageAuthRequired(() => {
	return {
		props: {
			test: 'this is a test',
		},
	}
})
