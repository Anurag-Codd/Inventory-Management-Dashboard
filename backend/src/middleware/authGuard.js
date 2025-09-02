import { jwtAccessVerify } from "../utils/jwt.js";

export default (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwtAccessVerify(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token Expired" });
    }

    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};
