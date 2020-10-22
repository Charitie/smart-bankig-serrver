import { Router } from "express";
import auth from "../lib/middlewares/auth";
import { accountService } from "./account.service";

export function getAccountRouter() {
	const accountRouter = Router();

	accountRouter.post("/deposit", auth, async (req, res) => {
		const userId = req.user.id;
		const { amount } = req.body;

		try {
			const deposit = await accountService.deposit(userId, amount);
			res.status(201).json({ message: "Deposit success", deposit });
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: "Server error", error: error.message });
		}
	});

	accountRouter.post("/withdraw", auth, async (req, res) => {
		const userId = req.user.id;
		const { amount } = req.body;

		try {
			const withdraw = await accountService.withdraw(userId, amount);
			res.status(201).json({ message: "Withdrawal success", withdraw });
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: "Server error", error: error.message });
		}
	});

	accountRouter.post("/transfer", auth, async (req, res) => {
		const userId = req.user.id;
		const { amount, toAccount } = req.body;

		try {
			const transfer = await accountService.transfer(userId, amount, toAccount);
			res.status(201).json({ message: "Transfer successfull", transfer });
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: "Server error", error: error.message });
		}
	});

	accountRouter.get("/balance", auth, async (req, res) => {
		const userId = req.user.id;

		try {
			const balance = await accountService.getAccountBalance(userId);
			res.status(201).json({ message: "Balance recieved", balance });
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: "Server error", error: error.message });
		}
	});

	return accountRouter;
}
