import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { connectDB } from "./config/db";
import "./config/passport"; 
import { PORT } from "./utils/constants";
import { errorHandler } from "./middleware/ErrorHandler";
dotenv.config({
    path: './.env'
  })

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(passport.initialize());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
connectDB();

app.get("/", (req, res) => res.send("API is running..."));

// Routes
import userrouter from "./routes/user.route";
import clubrouter from "./routes/club.route";
import authRoutes from "./routes/auth";
import taskRoutes from "./routes/task.router";
import leaderboardRoutes from "./routes/leaderboard.route";

app.use("/auth", authRoutes);
app.use("/api/user" , userrouter);
app.use("/api/club" , clubrouter);
app.use("/api/task", taskRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
