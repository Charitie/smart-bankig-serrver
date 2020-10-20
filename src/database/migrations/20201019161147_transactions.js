import { addTableTimestamps } from "../addTableTimestamps";
import {
	accountsTableName,
	transactionsTableName,
} from "../constants";

const transactionTypes = ["DEPOSIT", "WITHDRAWAL", "TRANSFER"];
async function createUuidExtension(knex) {
	await knex.raw('create extension if not exists "uuid-ossp"');
}

async function createTransactionsTable(knex) {
	await knex.schema.createTable(transactionsTableName, (table) => {
		table.string("id").primary().defaultTo(knex.raw("uuid_generate_v4()"));

		table
			.bigInteger("from_account")
			.references("account_number")
			.inTable(accountsTableName)
			.nullable();

		table
			.bigInteger("to_account")
			.references("account_number")
			.inTable(accountsTableName)
			.nullable();

		table.float("amount").notNull();

    table.enum("transaction_type", transactionTypes)
      .notNull();
	});

	await addTableTimestamps(knex, transactionsTableName);
}

export async function up(knex) {
	await createUuidExtension(knex);
	await createTransactionsTable(knex);
}

export async function down(knex) {
	await knex.schema.dropTable(transactionsTableName);
}
