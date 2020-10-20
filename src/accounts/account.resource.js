import {
	accountsTableName,
	transactionsTableName,
} from "../database/constants";
import { knexInstance } from "../database/knexInstance";
import { async } from "../database/migrations/20201018170209_users";

class AccountResource {
	async createAccount(accountDetails) {
		const createdAccount = await knexInstance(
			accountsTableName
		).insert(accountDetails, ["accountNumber", "balance"]);

		return createdAccount[0];
	}

	async getAccountBalance(userId) {
		const account = await knexInstance(accountsTableName)
		.select("balance")
		.where({ userId})
		.first();
		
		return account.balance;
	}

	async deposit(depositDetails) {
		const deposit = await knexInstance(
			transactionsTableName
		).insert(depositDetails, ["toAccount", "amount"]);
		return deposit[0];
	}

	async withdraw(withdrawDetails) {
		const withdraw = await knexInstance(
			transactionsTableName
		).insert(withdrawDetails, ["fromAccount", "amount"]);
		return withdraw[0];
	}

	async transfer(transferDetails) {
		const transfer = await knexInstance(
			transactionsTableName
		).insert(transferDetails, ["fromAccount", "toAccount", "amount"]);
		return transfer[0];
	}

	async updateBalance(accountNumber, newBalance) {
		const updatedAccount = await knexInstance(accountsTableName)
			.update({ balance: newBalance }, ["accountNumber", "balance"])
			.where({ accountNumber });
		return updatedAccount[0];
	}

	async getAccount(field, value) {
		return knexInstance(accountsTableName).where(field, value).first();
	}
}

export const accountResource = new AccountResource();
