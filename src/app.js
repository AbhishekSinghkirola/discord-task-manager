import express from "express";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));

// Import routes
import authRoutes from "./routes/auth.routes.js";

app.use("/api/v1/auth", authRoutes);

app.use(errorMiddleware);

export default app;
