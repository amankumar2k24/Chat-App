import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (userId, res) => {
  //generate token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  console.log("JWT generated:", token);

  //set cookie
  res.cookie("jwt", token, {
    httpOnly: true, // cookie only accessible by server
    maxAge: 24 * 60 * 60 * 1000,
    secure: true, // only set cookie over https in production
    // secure: true, // only set cookie over https in production
    sameSite: "strict", // prevent CSRF forgery attacks
  });
  console.log("Set-Cookie header:", res.getHeaders()["set-cookie"]);
};
