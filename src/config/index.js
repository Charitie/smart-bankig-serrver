import dotenv from "dotenv";
import joi from "joi";

dotenv.config();

const envVarsSchema = joi
	.object({
		NODE_ENV: joi.string().allow("development", "production", "testw"),
		PORT: joi.number().default(8000),
		DATABASE_NAME: joi.string().required(),
    DATABASE_DIALECT: joi.string().default('postgres'),
    DATABASE_PASSWORD: joi.string().default(null),
    DATABASE_USER: joi.string().required(),
    DATABASE_URL: joi.string().default(null),
    HOST: joi.string().required(),
    SECRET_KEY: joi.string().required(),
    JWT_EXPIRATION: joi.string().required(),
	})
	.unknown()
	.required();

export const getConfig = () => {
	const { error, value: envVariables } = envVarsSchema.validate(process.env);

	if (error) {
		throw new Error(`Config validation error: ${error.message}`)
	}
	const config = {
		env: envVariables.NODE_ENV,
		port: envVariables.PORT,
    db: {
      name: envVariables.DATABASE_NAME,
      username: envVariables.DATABASE_USER,
      password: envVariables.DATABASE_PASSWORD,
      databaseUrl: envVariables.DATABASE_URL,
      host: envVariables.HOST,
    },
    secretKey: envVariables.SECRET_KEY,
    jwtExpiration: envVariables.JWT_EXPIRATION,
	}

	return config;
};


