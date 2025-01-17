import dotenv from "dotenv";

dotenv.config();

const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: parseInt(process.env.COOKIE_MAX_AGE || "86400000", 10), // Default to 1 day
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  },
};

export default sessionConfig;