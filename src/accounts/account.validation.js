import { check } from "express-validator";

export const accountNumberValidations = [
	check("toAccount", "Invalid account number").isNumeric(),
];
