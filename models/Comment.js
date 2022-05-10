import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
	body: String,
	username: String,
	createdAt: String,
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post",
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

export default mongoose.model("Comment", CommentSchema);
