import { addTableTimestamps } from '../addTableTimestamps';
import { usersTableName } from '../constants';


async function createUuidExtension(knex) {
  await knex.raw('create extension if not exists "uuid-ossp"');
}

async function createUsersTable(knex) {
  await knex.schema.createTable(usersTableName, (table) => {
    table.string('id')
      .primary()
      .defaultTo(knex.raw('uuid_generate_v4()'));

    table.string('fullname')
    .notNull();

    table.string('email')
    .unique()
    .notNull();

    table.string('password')
    .notNull();

    table.string('phone')
    .notNull();
  })

  await addTableTimestamps(knex, usersTableName);
}

export async function up(knex) {
  await createUuidExtension(knex)
  await createUsersTable(knex)
};

export async function down(knex) {
  await knex.schema.dropTable(usersTableName);
};
