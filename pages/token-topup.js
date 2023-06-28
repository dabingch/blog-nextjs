import { withPageAuthRequired } from '@auth0/nextjs-auth0'

export default function TokenTopup() {
	return <div>TokenTopup</div>
}

export const getServerSideProps = withPageAuthRequired(() => {
	return {
		props: {
			test: 'this is a test',
		},
	}
})
