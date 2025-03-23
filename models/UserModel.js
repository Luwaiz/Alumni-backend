const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = mongoose.Schema(
	{
		name: {
			type: "string",
			required: true,
			trim: true,
		},

		password: {
			type: "string",
			required: true,
			minlength: [8, "Password must be at least 8 characters long"],
		},
		matricNo: {
			type: "string",
			required: true,
			unique: true,
			trim: true,
		},
		socialHandler: {
			type: "string",
			required: true,
			trim: true,
			unique: true,
		},
		phoneNo: {
			type: "string",
			required: true,
			unique: true,
			trim: true,
		},
		courseStudy: {
			type: "string",
			required: true,
			trim: true,
		},
		bestLecturer: {
			type: "string",
			required: true,
			trim: true,
		},
		bestQuote: {
			type: "string",
			required: true,
			trim: true,
		},
		bestFriend: {
			type: "string",
			required: true,
			trim: true,
		},
		bestMoment: {
			type: "string",
			required: true,
			trim: true,
		},
		miss: {
			type: "string",
			required: true,
			trim: true,
		},
		profilePicture: {
			type: "string", // Store the URL of the profile picture
			default: "", // Default to an empty string if no picture is uploaded
		  },
	},
	{ timestamps: true }
);

UserSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next(); // Prevent re-hashing on update

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// Method to compare hashed password during login
UserSchema.statics.login = async function (email, password) {
	const user = await this.findOne({ email });

	if (!user) {
		throw new Error(`Cannot find user with the email ${email}`);
	}

	const match = await bcrypt.compare(password, user.password);

	if (!match) {
		throw new Error("Invalid password");
	}

	return user;
};

const User = mongoose.model("user", UserSchema);

module.exports = User;

