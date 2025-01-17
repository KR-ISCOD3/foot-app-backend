import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import session from "express-session";
import sessionConfig from "./config/sessionConfig.js";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();
const app = express();
connectDB();
// Middleware
const allowedOrigins = ["http://localhost:5174","http://localhost:5173", "https://food-project-frontend-phi.vercel.app"]; 
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());
app.use(session(sessionConfig));
app.use("/api/auth", authRoutes);

// Routes
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
