import { OAuth2Client } from "google-auth-library";
import authModel from "../model/authModel.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // Ensure GOOGLE_CLIENT_ID is set in your environment variables

// Google Login Handler
export const login = async (req, res) => {
  const { token } = req.body;

  console.log(token);

  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }

  try {
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID, // Replace with your actual Google Client ID
    });

    // Extract user info from payload
    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(500).json({ error: "Invalid token payload" });
    }

    const userData = {
      id: payload.sub,
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    };

    console.log(userData);
    // Check if the user already exists in the database
    let user = await authModel.findOne({ email: userData.email });

    if (!user) {
      // If user doesn't exist, create a new one
      user = new authModel(userData);
      await user.save(); // Save the new user to the database
    }else if (user.googleId !== userData.id) {
      // If the user exists but has a different googleId, you can either update the user or handle the conflict
      // Example: update the googleId and other fields
      user.googleId = userData.id;
      user.picture = userData.picture;
      await user.save();
    }
    // Save user session
    req.session.user = userData;

    return res
      .status(200)
      .json({ message: "Login successful", user: userData });
  } catch (error) {
    console.error("Error verifying Google token:", error.message);
    return res.status(500).json({ error: "Failed to verify token" });
  }
};

// Logout Handler
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).json({ error: "Failed to log out" });
    }
    res.clearCookie("connect.sid"); // Ensure this matches the name of your session cookie
    return res.status(200).json({ message: "Logout successful" });
  });
};

// Get Profile Handler
export const getProfile = (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  return res
    .status(200)
    .json({ user: req.session.user, userID: req.session.user.id });
};
