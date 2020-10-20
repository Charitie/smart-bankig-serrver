import { check } from "express-validator";

export const registrationValidations = [
	check("fullname", "Full Name is required").not().isEmpty(),
	check("email", "Please include a valid email").isEmail(),
	check("phone", "Phone number should contain atleast 10 digits").isLength({
		min: 10,
	}),
	check("password", "Password should contain atleast 6 characters").isLength({
		min: 6,
	}),
];

export const loginValidations = [
	check("email", "Please include a valid email").isEmail(),
	check("password", "Password is required").exists(),
];
