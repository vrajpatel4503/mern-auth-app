import jwt from "jsonwebtoken";
import userModel from "../models/user.models.js";

export const verifyUser = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      (req.headers?.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No token provided",
      });
    }

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
      console.log(`Error in JWT verification :- ${error}`);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    if (!decodedToken?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const user = await userModel
      .findById(decodedToken.id)
      .select("-password -refreshToken");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();

    // try part end
  } catch (error) {
    console.log(`Error in verifyUser :- ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
