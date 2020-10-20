import { usersTableName } from "../database/constants";
import { knexInstance } from "../database/knexInstance";

class UserResource {
	async createUser(user) {
		const createdUser = await knexInstance(usersTableName).insert(user, [
			"id",
			"email",
			"fullname",
		]);
		return createdUser[0];
	}
	async getUser(field, value) {
		const user = await knexInstance(usersTableName)
			.select("*")
			.where(field, value)
			.first();
		return user;
	}
}

export const userResource = new UserResource();
