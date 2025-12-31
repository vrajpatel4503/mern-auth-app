import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: [10, "Phone number must be at least 10 digits"],
      maxlength: [10, "Phone number cannot exceed 10 digits"],
      match: [/^[0-9]{10}$/, "Phone number must contain only digits"],
    },

    avatar: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },

    joinedAt: {
      type: Date,
      default: Date.now(),
    },

    lastLogin: {
      type: Date,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// --------- Generate Access Token ---------
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      fullName: this.fullName,
      email: this.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

// --------- Generate Refresh Token ---------
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
