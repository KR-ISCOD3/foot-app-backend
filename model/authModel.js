import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true},
  name: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
