const { model, Schema } = require("mongoose");

const CommentSchema = new Schema({
	body: String,
	username: String,
	createdAt: String,
	post: {
		type: Schema.Types.ObjectId,
		ref: "Post",
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

module.exports = model("Comment", CommentSchema);
