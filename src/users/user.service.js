import { userResource } from "./user.resource";
import EncryptData from "../lib/helpers/encryptData";
import createToken from "../lib/helpers/jwtHelpers";
import { getConfig } from "../config/index";
import { accountService } from '../accounts/account.service';

const config = getConfig();

class UserService {
	async createUser(user) {
		const { fullname, email, phone, password } = user;
		const existingUser = await userResource.getUser("email", email);

		//check if email already exist
		if (existingUser) {
			throw new Error("Email already exists");
		}

		//hash password
		const encryptedPassword = EncryptData.generateHash(password);
		const createdUser = await userResource.createUser({
			fullname,
			email,
			password: encryptedPassword,
			phone,
		});

		//create token
		const token = createToken({ id: createdUser.id }, config.secretKey);

		//create account number
		const account = await accountService.createAccount(createdUser.id)
		const { accountNumber } = account;

		const registeredUser = {
			...createdUser,
			token,
      accountNumber
		};
		return registeredUser;
	}

  async login(userCredentials) {
		const { email, password } = userCredentials;
		
		//check if user exist
		const existingUser = await userResource.getUser("email", email);
		if (!existingUser) {
			throw new Error("Invalid credentials" );
    }

		//compare passwords
    const passwordMatch = await EncryptData.compareHash(password, existingUser.password);
		if (!passwordMatch) {
			throw new Error("Invalid credentials");
		}

		//create token
		const token = createToken({ id: existingUser.id }, config.secretKey);

		return {token, email: existingUser.email, fullname: existingUser.fullname };
	}
}

export const userService = new UserService();
