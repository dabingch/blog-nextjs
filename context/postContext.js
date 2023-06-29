import React, { useCallback, useState } from 'react'

export const PostsContext = React.createContext({})

export const PostsProvider = ({ children }) => {
	const [posts, setPosts] = useState([])

	const setPostsFromSSR = useCallback((postsFromSSR = []) => {
		console.log(postsFromSSR)
		setPosts(postsFromSSR)
	}, [])

	return (
		<PostsContext.Provider value={{ posts, setPostsFromSSR }}>
			{children}
		</PostsContext.Provider>
	)
}
