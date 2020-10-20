import jwt from "jsonwebtoken";
import { getConfig } from "../../config/index";

const config = getConfig();

function extractTokenFromAuthHeaders(req) {
	if (
		req.headers.authorization &&
		req.headers.authorization.split(" ")[0] === "Bearer"
	) {
		return req.headers.authorization.split(" ")[1];
	} else if (req.query && req.query.token) {
		return req.query.token;
	}
	return null;
}

export default function (req, res, next) {
	//Get token from header
	const token = extractTokenFromAuthHeaders(req);

	//Check if not token
	if (!token) throw new Error("No token, authorization denied");

	try {
		jwt.verify(token, config.secretKey, (error, decoded) => {
			if (error) {
				throw new Error("Token is not valid");
			} else {
        req.user = { id: decoded.id };
				next();
			}
		});
	} catch (err) {
		console.log("token error", err.message);
		throw new Error("Server Error");
	}
}
