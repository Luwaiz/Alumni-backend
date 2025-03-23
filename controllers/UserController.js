const express = require("express");
const User = require("../models/UserModel"); // Ensure correct path to your model
const bcrypt = require("bcryptjs");

const signUp = async (req, res) => {
	try {
		const {
			name,
			password,
			matricNo,
			socialHandler,
			phoneNo,
			courseStudy,
			bestLecturer,
			bestQuote,
			bestFriend,
			bestMoment,
			miss,
		} = req.body;

		// Validate input
		if (
			!name ||
			!password ||
			!matricNo ||
			!socialHandler ||
			!phoneNo ||
			!courseStudy ||
			!bestLecturer ||
			!bestQuote ||
			!bestFriend ||
			!bestMoment ||
			!miss
		) {
			return res.status(400).json({ message: "All fields are required" });
		}

		// Check if user already exists (using matricNo, socialHandler, or phoneNo)
		const existingUser = await User.findOne({
			$or: [{ matricNo }, { socialHandler }, { phoneNo }],
		});

		if (existingUser) {
			return res.status(400).json({
				message:
					"User with provided Matric No, Social Handler, or Phone No already exists",
			});
		}

		// Create new user
		const newUser = new User({
			name,
			password, // Password hashing is handled in the model
			matricNo,
			socialHandler,
			phoneNo,
			courseStudy,
			bestLecturer,
			bestQuote,
			bestFriend,
			bestMoment,
			miss,
		});

		await newUser.save();

		// Return success response (excluding password)
		res.status(201).json({
			message: "User registered successfully",
			user: {
				id: newUser._id,
				name: newUser.name,
				matricNo: newUser.matricNo,
				socialHandler: newUser.socialHandler,
				phoneNo: newUser.phoneNo,
				courseStudy: newUser.courseStudy,
				bestLecturer: newUser.bestLecturer,
				bestQuote: newUser.bestQuote,
				bestFriend: newUser.bestFriend,
				bestMoment: newUser.bestMoment,
				miss: newUser.miss,
				createdAt: newUser.createdAt,
			},
		});
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

const jwt = require("jsonwebtoken"); // Import JWT library

const logIn = async (req, res) => {
	try {
		const { matricNo, password } = req.body;

		// Validate input
		if (!matricNo || !password) {
			return res
				.status(400)
				.json({ message: "Matric number and password are required" });
		}

		// Find user by matric number
		const user = await User.findOne({ matricNo });
		if (!user) {
			return res
				.status(400)
				.json({ message: "Invalid matric number or password" });
		}

		// Compare password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res
				.status(400)
				.json({ message: "Invalid matric number or password" });
		}

		// Generate JWT token
		const token = jwt.sign(
			{ id: user._id, matricNo: user.matricNo }, // Payload
			process.env.JWT_SECRET, // Secret key (store this in your environment variables)
			{ expiresIn: "1h" } // Token expiration time
		);

		// Return success response with token
		res.status(200).json({
			message: "Login successful",
			token, // Include the token in the response
			user: {
				id: user._id,
				name: user.name,
				matricNo: user.matricNo,
				socialHandler: user.socialHandler,
				phoneNo: user.phoneNo,
				courseStudy: user.courseStudy,
				bestLecturer: user.bestLecturer,
				bestQuote: user.bestQuote,
				bestFriend: user.bestFriend,
				bestMoment: user.bestMoment,
				miss: user.miss,
				createdAt: user.createdAt,
			},
		});
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ message: "Server error" });
	}
};

const getUserProfile = async (req, res) => {
	try {
		const { matricNo } = req.params;

		// Find user by matricNo
		const user = await User.findOne({ matricNo }).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error("Error fetching user profile:", error);
		res.status(500).json({ message: "Server error" });
	}
};
// Get all users
const getAllUsers = async (req, res) => {
	try {
		const users = await User.find().select("-password"); // Exclude passwords

		res.status(200).json(users);
	} catch (error) {
		console.error("Error fetching users:", error);
		res.status(500).json({ message: "Server error" });
	}
};

module.exports = { signUp, logIn, getAllUsers, getUserProfile };
