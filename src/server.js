import express from "express";
import cors from "cors";
import morgan from "morgan";
import { getConfig } from "./config";
import { getUserRouter } from "./users/user.routes";
import { getAccountRouter } from "./accounts/account.routes";
import errorHandler from "./lib/middlewares/globalErrorHandler";

const { port } = getConfig();
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json({ extended: false }));

app.use("/users", getUserRouter());
app.use("/accounts", getAccountRouter());

app.get("/", (req, res) => res.send("Api running"));

// errorHandler should be added as the last middleware to the app
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
