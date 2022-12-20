const express = require("express");
const postsRouter = express.Router();
const { requireUser } = require("./utils");
const { getAllPosts, createPost, getUserById } = require("../db");

//send an error anytime there is no user
postsRouter.post("/", requireUser, async (req, res, next) => {
	const { title, content, tags = "" } = req.body;

	const tagArr = tags.trim().split(/\s+/);
	// req.user is entire user object

	const authorId = req.user.id;
	const postData = { authorId, title, content, tagArr };

	// only send the tags if there are some to send
	if (tagArr.length) {
		postData.tags = tagArr;
	}

	try {
		const post = await createPost(postData);
		console.log("This is the post", post);
		res.send({ post });

		// add authorId, title, content to postData object
		// const post = await createPost(postData);
		// this will create the post and the tags for us
		// if the post comes back, res.send({ post });
		// otherwise, next an appropriate error object
	} catch ({ name, message }) {
		next({ name, message });
	}
});

postsRouter.use((req, res, next) => {
	console.log("A request is being made to /posts!");

	next();
});

postsRouter.get("/", async (req, res) => {
	const posts = await getAllPosts();

	res.send({
		posts,
	});
});

module.exports = postsRouter;
