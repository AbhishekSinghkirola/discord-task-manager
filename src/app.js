import express from "express";
import morgan from "morgan";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(morgan("dev"));
app.use(cookieParser());

// Import routes
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.route.js";
import userRoutes from "./routes/user.route.js";
import teamRoutes from "./routes/team.routes.js";

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/team", teamRoutes);

app.use(errorMiddleware);

export default app;
