import User from "../models/user.model.js";

export const updateProfile = async (req, res) => {
  const { name, password } = req.body;
  const userId = req.userId;

  try {
    if ((!name || !name.trim()) && (!password || !password.trim())) {
      return res.status(400).json({
        error: "At least one field (name or password) must be provided",
      });
    }

    if (password.length < 8)
      res.status(400).json({ error: "Password is too short" });

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updates = {};

    if (name && name.trim()) {
      updates.name = name.trim();
    }

    if (password && password.trim()) {
      updates.password = password;
    }

    Object.assign(user, updates);
    await user.save();

    const { password: _, ...userResponse } = user.toObject();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
};
