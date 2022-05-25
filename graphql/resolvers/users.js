import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserInputError } from "apollo-server-express";

import {
	validateRegisterInput,
	validateLoginInput,
} from "../../util/validators.js";
import config from "../../config.js";
import User from "../../models/User.js";
import { pubsub } from "../../index.js"

function generateToken(user) {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.username,
		},
		config.SECRET_KEY,
		{ expiresIn: "1h" }
	);
}

export default {
	Query: {
		async getUsers() {
			try {
				const users = await User.find().sort({ createdAt: -1 });
				return users;
			} catch (err) {
				throw new Error(err);
			}
		},
		hello() {
			pubsub.publish("TESTING", { getMessage: "Hello I'm a message" });
      return "Hello World!";
    },
	},
	Mutation: {
		async login(_, { username, password }) {
			const { errors, valid } = validateLoginInput(username, password);

			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}

			const user = await User.findOne({ username });

			if (!user) {
				errors.general = "User not found";
				throw new UserInputError("User not found", { errors });
			}

			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				errors.general = "Wrong crendetials";
				throw new UserInputError("Wrong crendetials", { errors });
			}

			const token = generateToken(user);

			return {
				...user._doc,
				id: user._id,
				token,
			};
		},
		async register(
			_,
			{ registerInput: { username, email, password, confirmPassword } }
		) {
			// Validate user data
			const { valid, errors } = validateRegisterInput(
				username,
				email,
				password,
				confirmPassword
			);
			if (!valid) {
				throw new UserInputError("Errors", { errors });
			}
			// TODO: Make sure user doesnt already exist
			const user = await User.findOne({ username });
			if (user) {
				throw new UserInputError("Username is taken", {
					errors: {
						username: "This username is taken",
					},
				});
			}
			// hash password and create an auth token
			password = await bcrypt.hash(password, 12);

			const newUser = new User({
				email,
				username,
				password,
				createdAt: new Date().toISOString(),
			});

			const res = await newUser.save();

			const token = generateToken(res);

			return {
				...res._doc,
				id: res._id,
				token,
			};
		},
	},
	Subscription: {
		getMessage: {
      subscribe: (a, b, c) => {
				return pubsub.asyncIterator(["TESTING"])
			},
    },
	},
};
