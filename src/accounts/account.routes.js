import { Router } from "express";
import { validationResult } from "express-validator";

import auth from "../lib/middlewares/auth";
import { accountService } from "./account.service";
import {
	amountValidations,
	accountNumberValidations,
} from "./account.validation";

export function getAccountRouter() {
	const accountRouter = Router();

	accountRouter.post("/deposit", auth, async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const userId = req.user.id;
		const { amount } = req.body;

		try {
			const deposit = await accountService.deposit(userId, amount);
			res.status(201).json({ message: "You have successfully deposited", ...deposit });
		} catch (error) {
			next(error);
		}
	});

	accountRouter.post("/withdraw", auth, async (req, res, next) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const userId = req.user.id;
		const { amount } = req.body;

		try {
			const withdraw = await accountService.withdraw(userId, amount);
			res.status(201).json({ message: "You have successfully Withdrawn", ...withdraw });
		} catch (error) {
			next(error);
		}
	});

	accountRouter.post(
		"/transfer",
		auth,
		accountNumberValidations,
		async (req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({ errors: errors.array() });
			}

			const userId = req.user.id;
			const { amount, toAccount } = req.body;

			try {
				const transfer = await accountService.transfer(
					userId,
					amount,
					toAccount
				);
				res
					.status(201)
					.json({ message: "You have successfull transfered", ...transfer });
			} catch (error) {
				next(error);
			}
		}
	);

	accountRouter.get("/balance", auth, async (req, res) => {
		const userId = req.user.id;

		try {
			const balance = await accountService.getAccountBalance(userId);
			res.status(201).json({ message: "Balance recieved", balance });
		} catch (error) {
			next(error);
		}
	});

	return accountRouter;
}
