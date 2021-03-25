const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../Model/User");
const mongoDBErrorHelper = require("../../lib/mongoDBErrorHelper");

module.exports = {
	// Sign-up function
	signUp: async (req, res) => {
		try {
			// Hashes password
			let salted = await bcrypt.genSalt(10);
			let hashedPassword = await bcrypt.hash(req.body.password, salted);

			// Creates new user from input values
			let createdUser = new User({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				password: hashedPassword,
			});

			// Adds new user to database
			let savedUser = await createdUser.save();

			// Respond with new user info
			res.json({
				data: savedUser,
			});
		} catch (e) {
			// server encountered an unexpected condition that prevented it from fulfilling the request.
			// This error is usually returned by the server when no other error code is suitable.
			res.status(500).json(mongoDBErrorHelper(e));
		}
	},
	// Login function
	login: async (req, res) => {
		try {
			// MongoDB Shell Method (Collection)
			let foundUser = await User.findOne({ email: req.body.email });

			// Throws error is user is not found
			if (!foundUser) {
				throw {
					message: "Email is not registered, please go sign up!",
				};
			}

			// Compares input password with hashed password in DB
			let comparedPassword = await bcrypt.compare(
				req.body.password,
				foundUser.password
			);

			// Throws error message is incorrect
			if (!comparedPassword) {
				throw { message: "Check your email and password!" };
			} else {
				// JWT Token with 1 day expiration
				let jwtToken = jwt.sign(
					{
						email: foundUser.email,
					},
					"token",
					{ expiresIn: "1d" }
				);
				// Respond with JWT Token
				res.json({
					jwtToken: jwtToken,
				});
			}
		} catch (e) {
			// server encountered an unexpected condition that prevented it from fulfilling the request.
			// This error is usually returned by the server when no other error code is suitable.
			res.status(500).json(mongoDBErrorHelper(e));
		}
	},
};
