import User from "../models/user.model.js";
import {
  jwtAccess,
  jwtRefresh,
  jwtRefreshVerify,
  jwtTemp,
  jwtTempVerify,
} from "../utils/jwt.js";
import { bcryptCompare, bcryptHash, genOTP } from "../utils/bcrypt.js";
import { sendMail } from "../utils/sendMail.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password || password.length < 8) {
    return res.status(400).json({ error: "enter valid credentials" });
  }
  try {
    const normalEmail = email.trim().toLowerCase();
    const existedUser = await User.findOne({ email: normalEmail });

    if (existedUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    await User.create({ name, email: normalEmail, password });

    return res.status(201).json({
      message: "User signed up successfully",
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "enter valid credentials" });
  }

  try {
    const normalEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalEmail }).select("+password");

    if (!user) {
      return res.status(404).json({ error: "Enter valid email or password" });
    }

    const isValidPass = await bcryptCompare(password, user.password);

    if (!isValidPass) {
      return res.status(404).json({ error: "Enter valid email or password" });
    }

    const accessToken = jwtAccess(user);
    jwtRefresh(user, res);

    return res.status(200).json({
      message: "User logged in successfully",
      user: user.toObject(),
      access: accessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("$INVTOKEN");
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email.trim()) {
    return res.status(400).json({ error: "enter valid credentials" });
  }

  try {
    const normalEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalEmail });

    if (!user) {
      return res.status(404).json({ error: "Enter valid credentials" });
    }

    const OTP = genOTP();
    user.resetOTP = await bcryptHash(OTP, 12);
    user.OTPExpiresIn = new Date(Date.now() + 30 * 60 * 1000);

    await user.save();
    await sendMail(email, OTP);
    return res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const OTPVerification = async (req, res) => {
  const { email, OTP } = req.body;

  if (!email || !OTP) {
    return res.status(400).json({ error: "Enter valid credentials" });
  }

  try {
    const normalEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalEmail });
    if (!user || user.OTPExpiresIn < new Date()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
    const isValid = await bcryptCompare(OTP, user.resetOTP);
    if (!isValid) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    user.resetOTP = null;
    user.OTPExpiresIn = null;
    await user.save();

    const Temp = jwtTemp(user);

    return res.status(200).json({
      message: "OTP verification done successfully",
      temp: Temp,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

export const updateForgottenPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decode = jwtTempVerify(token);
    if (!decode) {
      return res.status(400).json({ error: "Invalid or expired Token" });
    }
    const { id, email } = decode;
    const user = await User.findOne({ _id: id, email }).select("+password");

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: "Inavlid credentails" });
    }

    user.password = password;
    await user.save();
  
    return res.status(200).json({ message: "Password update Successfully" });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export const RefreshToken = async (req, res) => {
  try {
    const tokenData = req.cookies["$INVTOKEN"];
    if (!tokenData) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    let decoded;
    try {
      decoded = jwtRefreshVerify(tokenData);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token Expired" });
      } else if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token" });
      }
      return res.status(500).json({ error: "Something went wrong" });
    }

    const user = await User.findById(decoded.id).lean();
    if (!user) {
      return res.status(401).json({ error: "Unauthorized Access" });
    }

    const accessToken = jwtAccess(user);

    return res.status(200).json({
      message: "Access token refreshed",
      user,
      access: accessToken,
    });
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
