import React, { useCallback, useState } from 'react'

export const PostsContext = React.createContext({})

export const PostsProvider = ({ children }) => {
	const [posts, setPosts] = useState([])
	const [isNoMorePost, setIsNoMorePost] = useState(false)

	const setPostsFromSSR = useCallback((postsFromSSR = []) => {
		// ! We can't write like this since these two functions share same posts state
		// setPosts((oldValue) => [...oldValue, ...postsFromSSR])
		setPosts((oldValue) => {
			const newPosts = [...oldValue]
			postsFromSSR.forEach((post) => {
				const existedPost = newPosts.find((p) => p._id === post._id)
				if (!existedPost) {
					newPosts.push(post)
				}
			})

			return newPosts
		})
	}, [])

	const getPosts = useCallback(
		async ({ lastPostDate, getNewerPosts = false }) => {
			const response = await fetch('/api/getPosts', {
				method: 'POST',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ lastPostDate, getNewerPosts }),
			})
			const postsResult = (await response.json()) || []

			if (postsResult.length < (Number(process.env.POST_LIMIT) || 2)) {
				setIsNoMorePost(true)
			}

			// setPosts((oldValue) => [...oldValue, ...postsResult])
			setPosts((oldValue) => {
				const newPosts = [...oldValue]
				postsResult.forEach((post) => {
					const existedPost = newPosts.find((p) => p._id === post._id)
					if (!existedPost) {
						newPosts.push(post)
					}
				})

				return newPosts
			})
		},
		[]
	)

	return (
		<PostsContext.Provider
			value={{ posts, setPostsFromSSR, getPosts, isNoMorePost }}
		>
			{children}
		</PostsContext.Provider>
	)
}
