import generateUniqueId from "generate-unique-id";
import { accountResource } from "./account.resource";
import CustomError from "../lib/util/customError";

class AccountService {
	async createAccount(userId, balance = 0) {
		const accountNumber = generateUniqueId({
			length: 15,
			useLetters: false,
		});
		const accountDetails = await accountResource.createAccount({
			userId,
			accountNumber,
			balance,
		});
		return accountDetails;
	}

	async getAccountBalance(userId) {
		const accountBalance = await accountResource.getAccountBalance(userId);
		return accountBalance;
	}

	async deposit(userId, amountToDeposit) {
		const amount = parseFloat(amountToDeposit);
		const { accountNumber, balance } = await accountResource.getAccount(
			"userId",
			userId
		);
		const transactionType = "DEPOSIT";

		await accountResource.deposit({
			toAccount: accountNumber,
			amount,
			transactionType,
		});

		if (!amount) {
			throw new CustomError(422, "Please enter amount more than 0");
		}

		if (amount <= 0) {
			throw new CustomError(422, "Please enter amount more than 0");
		}

		const newBalance = balance + amount;
		await accountResource.updateBalance(accountNumber, newBalance);
		return {
			newBalance,
			amount,
			accountNumber,
		};
	}

	async withdraw(userId, amountToWithdraw) {
		const amount = parseFloat(amountToWithdraw);
		const { accountNumber, balance } = await accountResource.getAccount(
			"userId",
			userId
		);
		const transactionType = "WITHDRAWAL";

		await accountResource.withdraw({
			fromAccount: accountNumber,
			amount,
			transactionType,
		});

		if (!amount) {
			throw new CustomError(422, "Please enter amount more than 0");
		}

		if (balance < amount) {
			throw new CustomError(422, "Insufficient fund");
		}

		if (amount <= 0) {
			throw new CustomError(422, "Please enter amount more than 0");
		}

		const newBalance = balance - amount;
		await accountResource.updateBalance(accountNumber, newBalance);
		return {
			newBalance,
			amount,
			accountNumber,
		};
	}

	async transfer(userId, amountToTransfer, toAccountNumber) {
		const amount = parseFloat(amountToTransfer);
		const {
			accountNumber: fromAccount,
			balance: fromBalance,
		} = await accountResource.getAccount("userId", userId);

		const toAccount = await accountResource.getAccount(
			"accountNumber",
			toAccountNumber
		);
		
		if (!toAccount) {
			throw new CustomError(400, "Invalid account number");
		}

		const { balance: toBalance } = toAccount;
		const transactionType = "TRANSFER";

		await accountResource.transfer({
			fromAccount,
			toAccount: toAccountNumber,
			amount,
			transactionType,
		});

		if (!amount) {
			throw new CustomError(422, "Please enter amount more than 0");
		}

		if (fromBalance < amount) {
			throw new CustomError(422, "Insufficient fund");
		}

		if (amount <= 0) {
			throw new CustomError(422, "Please Enter amount more than 0");
		}

		const fromAccountBalance = fromBalance - amount;
		const toAccountBalance = toBalance + amount;

		await accountResource.updateBalance(toAccountNumber, toAccountBalance);
		await accountResource.updateBalance(fromAccount, fromAccountBalance);

		return {
			balance: fromAccountBalance,
			amountTransfered: amount,
			accountNumber: toAccountNumber,
		};
	}
}

export const accountService = new AccountService();
