import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const ProtectedRoute = async (req, res, next) => {
  try {
    console.log("Incoming cookies:", req.cookies);
    const token = req?.cookies?.jwt;
    console.log("Token received:", token);
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    // console.log("user", user);
    req.user = user;
    next();
  } catch (err) {
    console.log("error from protectedRoute", err);
    res.status(500).json({ message: err.message });
  }
};
