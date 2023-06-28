import { withPageAuthRequired } from '@auth0/nextjs-auth0'

export default function New({ test }) {
	return <div>{test}</div>
}

// props for the component in SSR
export const getServerSideProps = withPageAuthRequired(() => {
	return {
		props: {
			test: 'this is a test',
		},
	}
})
