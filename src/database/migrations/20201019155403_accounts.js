import { addTableTimestamps } from "../addTableTimestamps";
import { accountsTableName, usersTableName } from "../constants";

async function createUuidExtension(knex) {
	await knex.raw('create extension if not exists "uuid-ossp"');
}

async function createAccountsTable(knex) {
	await knex.schema.createTable(accountsTableName, (table) => {
    table.string("id")
      .primary()
      .defaultTo(knex.raw("uuid_generate_v4()"));

		table
			.string("user_id")
			.references("id")
			.inTable(usersTableName)
			.unique()
			.notNull();

		table.float("balance").notNull().defaultTo(0);

		table.bigInteger("account_number").unique().notNull();
	});

	await addTableTimestamps(knex, accountsTableName);
}

export async function up(knex) {
	await createUuidExtension(knex);
	await createAccountsTable(knex);
}

export async function down(knex) {
	await knex.schema.dropTable(accountsTableName);
}
