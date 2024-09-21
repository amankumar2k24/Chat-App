import User from "../models/user.model.js";

export const getSidebarUser = async (req, res) => {
  try {
    if (!req.user)
      return res
        .status(401)
        .json({ message: "You are not authorized to access this route" });
    if (req.user && !req.user._id)
      return res.status(401).json({ message: "Unauthorized user id" });

    const loggedInUser = req.user._id;

    const user = await User.find({ _id: { $ne: loggedInUser } }).select(
      "-password"
    );
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
