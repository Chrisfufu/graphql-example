const { AuthenticationError, UserInputError } = require("apollo-server");

const checkAuth = require("../../util/check-auth");
const Post = require("../../models/Post");
const Comment = require("../../models/Comment");
const User = require("../../models/User");

module.exports = {
	Mutation: {
		createComment: async (_, { postId, body }, context) => {
			const user = checkAuth(context);
			if (body.trim() === "") {
				throw new UserInputError("Empty comment", {
					errors: {
						body: "Comment body must not empty",
					},
				});
			}

			const post = await Post.findById(postId);
			let userfromdb = await User.findById(user.id);
			if (post) {
				let comment = new Comment({
					body,
					user: userfromdb,
					post,
					username: userfromdb.username,
					createdAt: new Date().toISOString(),
				});
				let res = await comment.save();
				post.comments.push(res.id);
				let postres = await post.save();
				console.log("postres", postres);
				return comment;
			} else throw new UserInputError("Post not found");
		},
		async deleteComment(_, { postId, commentId }, context) {
			const { username } = checkAuth(context);

			const post = await Post.findById(postId).populate("comments");

			if (post) {
				const commentIndex = post.comments.findIndex((c) => {
					console.log("c::::", c._id, commentId, c._id == commentId);
					return c._id == commentId;
				});
				console.log(commentIndex);
				if (post.comments[commentIndex].username === username) {
					post.comments.splice(commentIndex, 1);
					await post.save();
					await Comment.deleteOne({ id: commentId })
						.then(function () {
							console.log("Data deleted"); // Success
						})
						.catch(function (error) {
							console.log(error); // Failure
						});
					return post;
				} else {
					throw new AuthenticationError("Action not allowed");
				}
			} else {
				throw new UserInputError("Post not found");
			}
		},
	},
};
