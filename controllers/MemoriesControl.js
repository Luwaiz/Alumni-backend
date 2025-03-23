const express = require("express");
const multer = require("multer");
const router = express.Router();
const Posts = require("../models/Memories");
const authMiddleware = require("../middleware/authMiddlewares");
// Configure multer for image uploads
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/"); // Save images in the 'uploads' folder
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + "-" + file.originalname); // Unique filename
	},
});

const upload = multer({ storage });

// Create a new post
router.post("/create", upload.single("image"), async (req, res) => {
	try {
		console.log("Request Body:", req.body); // Log the request body
		console.log("Uploaded File:", req.file); // Log the uploaded file

		const { ownerName, ownerId } = req.user; // Get user info from the token
		const imageUrl = req.file.path; // Path to the uploaded image

		// Validate required fields
		if (!ownerName || !ownerId || !imageUrl) {
			return res.status(400).json({ message: "All fields are required" });
		}

		const newPost = new Posts({
			imageUrl,
			ownerName,
			ownerId,
		});
		console.log(newPost);
		await newPost.save();
		res.status(201).json(newPost);
	} catch (error) {
		console.error("Error creating post:", error);
		res.status(500).json({ message: "Server error" });
	}
});
router.get("/feed", async (req, res) => {
	try {
		const posts = await Posts.find().sort({ createdAt: -1 }); // Sort by latest first
		res.status(200).json(posts);
	} catch (error) {
		console.error("Error fetching posts:", error);
		res.status(500).json({ message: "Server error" });
	}
});

router.post("/like/:postId", async (req, res) => {
	try {
		const post = await Posts.findById(req.params.postId);
		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		post.likes += 1; // Increment likes
		await post.save();

		res.status(200).json(post);
	} catch (error) {
		console.error("Error liking post:", error);
		res.status(500).json({ message: "Server error" });
	}
});

module.exports = router;
