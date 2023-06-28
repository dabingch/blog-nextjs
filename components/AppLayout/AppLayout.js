import Image from 'next/image'
import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0/client'

export const AppLayout = ({ children }) => {
	const { user, error, isLoading } = useUser()

	return (
		<div className='grid grid-cols-[300px_1fr] h-screen max-h-screen'>
			<div className='flex flex-col text-white overflow-hidden'>
				<div className='bg-slate-800'>
					<div>logo</div>
					<div>cta button</div>
					<div>tokens</div>
				</div>
				<div className='flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800'>
					list of posts
				</div>
				<div className='bg-cyan-800 flex items-center gap-2 border-t border-t-black/50 h-20 px-2'>
					{isLoading && <p>Loading login info...</p>}
					{error && <p>{error.message}</p>}
					{user ? (
						<>
							<div className='min-w-[50px]'>
								<Image
									src={user.picture}
									alt={user.name}
									height={50}
									width={50}
									className='rounded-full'
								/>
							</div>
							<div className='flex-1 flex-col gap-2'>
								<p className='font-bold'>{user.email}</p>
								<Link
									className='text-sm'
									href='/api/auth/logout'
								>
									Logout
								</Link>
							</div>
						</>
					) : (
						<Link href='/api/auth/login'>Login</Link>
					)}
				</div>
			</div>
			<div className=''>{children}</div>
		</div>
	)
}
