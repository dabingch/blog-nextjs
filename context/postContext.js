import React, { useCallback, useReducer, useState } from 'react'

export const PostsContext = React.createContext({})

const initialState = []

function postReducer(state, action) {
	switch (action.type) {
		case 'add_post': {
			const newPosts = [...state]
			action.payload.forEach((post) => {
				const existedPost = newPosts.find((p) => p._id === post._id)
				if (!existedPost) {
					newPosts.push(post)
				}
			})

			return newPosts
		}
		case 'delete_post': {
			const newPosts = state.filter((post) => post._id !== action.payload)

			return newPosts
		}
		default:
			return state
	}
}

export const PostsProvider = ({ children }) => {
	const [posts, dispatch] = useReducer(postReducer, initialState)
	const [isNoMorePost, setIsNoMorePost] = useState(false)

	const setPostsFromSSR = useCallback((postsFromSSR = []) => {
		dispatch({ type: 'add_post', payload: postsFromSSR })
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

			dispatch({ type: 'add_post', payload: postsResult })
		},
		[]
	)

	const deletePost = useCallback((postId) => {
		dispatch({ type: 'delete_post', payload: postId })
	}, [])

	return (
		<PostsContext.Provider
			value={{
				posts,
				setPostsFromSSR,
				getPosts,
				deletePost,
				isNoMorePost,
			}}
		>
			{children}
		</PostsContext.Provider>
	)
}
