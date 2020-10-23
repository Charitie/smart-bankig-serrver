import { Router } from "express";
import { userService } from "./user.service";
import { validationResult } from "express-validator";
import { loginValidations, registrationValidations } from "./user.validations";

export function getUserRouter() {
	const userRouter = Router();

	userRouter.post("/register", registrationValidations, async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await userService.createUser(req.body);
			res.status(201).json({ message: "User created", user });
		} catch (error) {
			next(error);
		}
	});

	userRouter.post("/login", loginValidations, async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const response = await userService.login(req.body);
			res
				.status(201)
				.json({ message: "User Logged in successfully", ...response });
		} catch (error) {
			next(error);
		}
	});
	return userRouter;
}
