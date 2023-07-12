import { useContext, useEffect } from 'react';
import { PostsContext } from '../../context/postContext';
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '../Logo';
import { faCoins } from '@fortawesome/free-solid-svg-icons';
import { useUser } from '@auth0/nextjs-auth0/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const AppLayout = ({
	children,
	availableTokens,
	posts: postsFromSSR,
	postId,
	postCreated,
}) => {
	const { user, error, isLoading } = useUser();

	const { setPostsFromSSR, posts, getPosts, isNoMorePost } =
		useContext(PostsContext);

	useEffect(() => {
		setPostsFromSSR(postsFromSSR);

		if (postId) {
			const exists = postsFromSSR.find((post) => post._id === postId);

			// if the current post id does not exist,
			// means that user has refreshed the page
			if (!exists) {
				getPosts({ lastPostDate: postCreated, getNewerPosts: true });
			}
		}
	}, [postsFromSSR, setPostsFromSSR, postId, postCreated, getPosts]);

	const handleLoadMorePost = async () => {
		await getPosts({ lastPostDate: posts[posts.length - 1].created });
	};

	return (
		<div className='grid grid-cols-[300px_1fr] h-screen max-h-screen'>
			<div className='flex flex-col overflow-hidden text-white'>
				<div className='px-2 bg-slate-800'>
					<Logo />
					<Link href='/post/new' className='btn'>
						New Post
					</Link>
					<Link
						href='/token-topup'
						className='block mt-2 text-center'
					>
						<FontAwesomeIcon
							icon={faCoins}
							className='text-yellow-500'
						/>
						<span className='pl-1'>
							{availableTokens} tokens available
						</span>
					</Link>
				</div>
				<div className='flex-1 px-4 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800'>
					{posts?.map((post) => (
						<Link
							key={post._id}
							href={`/post/${post._id}`}
							className={`py-1 border border-white/0 block text-ellipsis overflow-hidden whitespace-nowrap my-2 px-2 hover:bg-white/10 cursor-pointer rounded-sm ${
								postId == post._id
									? 'bg-white/50 border-white'
									: ''
							}`}
						>
							{post.topic}
						</Link>
					))}
					{!isNoMorePost && (
						<div
							onClick={handleLoadMorePost}
							className='mt-4 text-sm text-center cursor-pointer hover:underline text-slate-400'
						>
							Load more posts
						</div>
					)}
				</div>
				<div className='flex items-center h-20 gap-2 px-2 border-t bg-cyan-800 border-t-black/50'>
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
							<div className='flex-col flex-1 gap-2'>
								<div className='font-bold'>{user.email}</div>
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
			{children}
		</div>
	);
};
