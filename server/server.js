import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import connectDB from "./config/mongodb.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 6007;

// call the mongodb connection function
connectDB();



// middle ware for all api
app.use(express.json());
app.use(cookieParser());

// cors
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// API Endpoints
app.get("/", (req, res) => {
  res.send("API working fine");
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.listen(port, () => {
  console.log(`server is running on port:${port}`);
});
