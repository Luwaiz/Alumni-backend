const {
	signUp,
	logIn,
	getUserProfile,
	getAllUsers,
} = require("../controllers/UserController");
const express = require("express");
const authMiddleware = require("../middleware/authMiddlewares");
const router = express.Router();

router.post("/signup", signUp);
router.post("/logIn", logIn);
router.post("/getProfile",authMiddleware, getUserProfile);
router.post("/getAllUsers",authMiddleware, getAllUsers);

module.exports = router;
