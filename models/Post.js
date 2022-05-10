import  mongoose from "mongoose";

const postSchema = new mongoose.Schema({
	body: String,
	username: String,
	createdAt: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment",
		},
	],
	likes: [
		{
			username: String,
			createdAt: String,
		},
	],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

export default mongoose.model("Post", postSchema);
