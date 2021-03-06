import { AuthenticationError, UserInputError } from "apollo-server";

import Post from "../../models/Post.js";
import User from "../../models/User.js";
import checkAuth from "../../util/check-auth.js";
import { pubsub } from "../../index.js";

export default {
	Post: {
		likeCount: (parent) => parent.likes.length,
		commentCount: (parent) => parent.comments.length,
	},
	Query: {
		async getPosts() {
			try {
				const posts = await Post.find()
					.populate("user comments")
					.sort({ createdAt: -1 });
				// let userInfo = await User.findById(posts.user)
				// console.log(userInfo);
				return posts;
			} catch (err) {
				throw new Error(err);
			}
		},
		async getPost(_, { postId }) {
			try {
				const post = await Post.findById(postId).populate("user comments");
				if (post) {
					return post;
				} else {
					throw new Error("Post not found");
				}
			} catch (err) {
				throw new Error(err);
			}
		},
		async getPostsByUserId(parent, { userId }) {
			try {
				// console.log('parent::', parent, userId);
				const posts = await Post.find({ user: userId })
					.populate("user")
					.sort({ createdAt: -1 });
				return posts;
			} catch (err) {
				throw new Error(err);
			}
		},
	},
	// Post:{
	//   user: async ()=>{
	//     return await User.findById("627199638461065ee8969684");
	//   }
	// },
	Mutation: {
		async createPost(_, { body, imagePaths }, context) {
			const user = checkAuth(context);
			if (body.trim() === "") {
				throw new Error("Post body must not be empty");
			}

			let userfromdb = await User.findById(user.id);
			let allImages = [];
			console.log('imagePaths', imagePaths);
			// imagePaths.forEach((path) => {
			// 	allImages.push({ imageLink: path.imagePath });
			// });
			const newPost = new Post({
				body,
				user: userfromdb,
				username: user.username,
				createdAt: new Date().toISOString(),
				images: imagePaths,
			});

			const post = await newPost.save();

			pubsub.publish("NEW_POST", {
				newPost: post,
			});

			return post;
		},
		async deletePost(_, { postId }, context) {
			const user = checkAuth(context);

			try {
				const post = await Post.findById(postId);
				if (user.username === post.username) {
					await post.delete();
					return "Post deleted successfully";
				} else {
					throw new AuthenticationError("Action not allowed");
				}
			} catch (err) {
				throw new Error(err);
			}
		},
		async likePost(_, { postId }, context) {
			const { username } = checkAuth(context);

			const post = await Post.findById(postId);
			if (post) {
				let found = post.likes.find((like) => like.username === username);
				if (found) {
					// Post already likes, unlike it
					post.likes = post.likes.filter((like) => like.username !== username);
				} else {
					// Not liked, like post
					post.likes.push({
						username,
						createdAt: new Date().toISOString(),
					});
				}

				await post.save();
				return post;
			} else {
				console.error("Post not found");
			}
		},
	},
	Subscription: {
		newPost: {
			subscribe: (a, b, c) => {
				return pubsub.asyncIterator("NEW_POST");
			},
		},
	},
};
