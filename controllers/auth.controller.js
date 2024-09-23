import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

//register
export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
    //matching password
    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Password doesn't match",
      });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        message: "Username already exist",
      });
    }

    //hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashPassword = bcrypt.hashSync(password, salt);

    //add profile pic
    const girlProfilePic = `https://avatar.iran.liara.run/public/gir/username=${username}l`;
    const boyProfilePic = `https://avatar.iran.liara.run/public/boy/username=${username}`;

    //create new user
    const newUser = await User.create({
      fullName,
      username,
      password: hashPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);

      return res.status(201).json({
        message: "Registered successfully",
        result: {
          fullName: newUser.fullName,
          username: newUser.username,
          profilePic: newUser.profilePic,
        },
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid password" });
    }

    generateTokenAndSetCookie(user._id, res);

    return res.status(200).json({
      message: "Logged in successfully",
      result: {
        fullName: user.fullName,
        username: user.username,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

//logout
export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
