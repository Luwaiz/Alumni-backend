const {
	signUp,
	logIn,
	getUserProfile,
	getAllUsers,
} = require("../controllers/UserController");
const express = require("express");
const authMiddleware = require("../middleware/authMiddlewares");
const router = express.Router();
const upload = require("../middleware/multer");

router.post("/signup", upload.single("profilePicture"), signUp);
router.post("/logIn", logIn);
router.get("/getProfile/:matricNo", authMiddleware, getUserProfile);
router.get("/getAllUsers", authMiddleware, getAllUsers);

module.exports = router;
