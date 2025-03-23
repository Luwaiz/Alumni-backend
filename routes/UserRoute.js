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
router.get("/getProfile",authMiddleware, getUserProfile);
router.get("/getAllUsers",authMiddleware, getAllUsers);

module.exports = router;
