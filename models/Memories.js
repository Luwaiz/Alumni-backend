const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
	imageUrl: { type: "string", required: true }, // URL of the uploaded image
	ownerName: { type: "string", required: true }, // Name of the post owner
	ownerId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	}, // ID of the post owner
	likes: { type: "number", default: 0 }, // Number of likes
	createdAt: { type: "date", default: Date.now }, // Timestamp
});

const Posts = mongoose.model("Post", PostSchema);
module.exports = Posts;
