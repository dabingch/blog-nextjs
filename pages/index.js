import Link from 'next/link'

export default function Home() {
	return (
		<div>
			<h1>this is the homepage</h1>
			<div>
				<Link href='/api/auth/login'>Login</Link>
			</div>
		</div>
	)
}
