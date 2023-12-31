import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../../lib/mongodb";

export default withApiAuthRequired(async function handler(req, res) {
	try {
		const { user } = await getSession(req, res);
		const client = await clientPromise;
		const db = await client.db("blogpostai");

		const existedUser = await db
			.collection("users")
			.findOne({ auth0Id: user.sub });

		const { lastPostDate, getNewerPosts } = req.body;

		const posts = await db
			.collection("posts")
			.find({
				userId: existedUser._id,
				created: {
					[getNewerPosts ? "$gt" : "$lt"]: new Date(lastPostDate),
				},
			})
			.limit(getNewerPosts ? 0 : Number(process.env.POST_LIMIT) || 2)
			.sort({ created: -1 })
			.toArray();

		// here we return a array of posts, so the state of context can be an array
		res.status(200).json(posts);
	} catch (error) {
		console.log(error);
	}
});
