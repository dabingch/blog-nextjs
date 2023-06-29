import { Configuration, OpenAIApi } from 'openai'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'
import clientPromise from '../../lib/mongodb'

export default withApiAuthRequired(async function handler(req, res) {
	const { user } = await getSession(req, res)
	const client = await clientPromise
	const db = await client.db('blogpostai')

	const userProfile = await db.collection('users').findOne({
		auth0Id: user.sub,
	})

	if (!userProfile?.availableTokens) {
		res.status(403).json({ error: 'Not enough tokens' })
		return
	}

	const { topic, keywords } = req.body

	if (!topic || !keywords) {
		res.status(403).json({ error: 'Missing topic or keywords' })
	}

	const config = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
	})

	const openai = new OpenAIApi(config)

	await db.collection('users').updateOne(
		{
			auth0Id: user.sub,
		},
		{
			$inc: {
				availableTokens: -1,
			},
		}
	)

	// * Old model version
	const response = await openai.createCompletion({
		model: 'text-davinci-003',
		temperature: 0,
		max_tokens: 3600,
		prompt: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
	  The content should be formatted in SEO-friendly HTML.
	  The response must also include appropriate HTML title and meta description content.
	  The return format must be stringified JSON in the following format:
	  {
	    "postContent": post content here,
	    "title": title here,
	    "metaDescription": meta description goes here
	  }
	  `,
	})

	const data = response.data.choices[0]?.text.split('\n').join('')
	const parsed = JSON.parse(data)

	const post = await db.collection('posts').insertOne({
		postContent: parsed?.postContent,
		title: parsed?.title,
		metaDescription: parsed?.metaDescription,
		topic,
		keywords,
		userId: userProfile._id,
		created: new Date(),
	})

	res.status(201).json({
		postId: post.insertedId,
	})

	// * GPT-3.5
	/*
	const postContentResponse = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		temperature: 0,
		messages: [
			{
				role: 'system',
				content: 'You are a blog post generator',
			},
			{
				role: 'user',
				content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
	      The content should be formatted in SEO-friendly HTML,
        limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i.`,
			},
		],
	})

	const postContent =
		postContentResponse.data.choices[0]?.message?.content || ''

	const titleResponse = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		temperature: 0,
		messages: [
			{
				role: 'system',
				content: 'You are a blog post generator',
			},
			{
				role: 'user',
				content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
	      The content should be formatted in SEO-friendly HTML,
        limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i.`,
			},
			{
				role: 'assistant',
				content: 'postContent',
			},
			{
				role: 'user',
				content:
					'Generate appropriate title tag text for the above blog post',
			},
		],
	})

	const metaDescriptionResponse = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		temperature: 0,
		messages: [
			{
				role: 'system',
				content: 'You are a blog post generator',
			},
			{
				role: 'user',
				content: `Write a long and detailed SEO-friendly blog post about ${topic}, that targets the following comma-separated keywords: ${keywords}.
	      The content should be formatted in SEO-friendly HTML,
        limited to the following HTML tags: p, h1, h2, h3, h4, h5, h6, strong, li, ol, ul, i.`,
			},
			{
				role: 'assistant',
				content: 'postContent',
			},
			{
				role: 'user',
				content: `Generate SEO-friendly meta description for the above blog post`,
			},
		],
	})

	const title = titleResponse.data.choices[0]?.message?.content || ''
	const metaDescription =
		metaDescriptionResponse.data.choices[0]?.message?.content || ''

	

	res.status(200).json({
		post: {
			postContent,
			title,
			metaDescription,
		},
	})
  */
})
