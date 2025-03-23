const express = require("express");
const multer = require("multer");
const router = express.Router();
const Post = require("../models/Memories"); // Import the correct model
const authMiddleware = require("../middleware/authMiddlewares");
const fs = require("fs"); // Import the fs module
const path = require("path"); // Import the path module

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // Create the directory if it doesn't exist
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Save images in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});

const upload = multer({ storage });

// Create a new post
router.post(
    "/create",
    authMiddleware,
    upload.single("image"),
    async (req, res) => {
      try {
        console.log("Request Body:", req.body); // Log the request body
        console.log("Uploaded File:", req.file); // Log the uploaded file
        console.log("User Info:", req.user); // Log the user info from the token
  
        const { name: ownerName, id: ownerId } = req.user; // Get user info from the token
        const imageUrl = req.file.path; // Path to the uploaded image
  
        // Validate required fields
        if (!ownerName || !ownerId || !imageUrl) {
          return res.status(400).json({ message: "All fields are required" });
        }
  
        const newPost = new Post({
          imageUrl,
          ownerName,
          ownerId,
        });
  
        await newPost.save();
        res.status(201).json(newPost);
      } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ message: "Server error" });
      }
    }
  );
// Fetch all posts
router.get("/feed", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Sort by latest first
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Like a post
router.post("/like/:postId", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
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