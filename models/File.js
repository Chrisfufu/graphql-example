import mongoose from "mongoose";

const FileSchema = new mongoose.Schema({
	link: String,
	post: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Post",
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
});

export default mongoose.model("File", FileSchema);