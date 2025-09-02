import jwt from "jsonwebtoken";

export const jwtAccess = (user) => {
  try {
    const Token = jwt.sign(
      { userId: user._id, createdAt: user.createdAt },
      process.env.JWT_ACCESS_KEY,
      {
        expiresIn: "15m",
      }
    );
    return Token;
  } catch (error) {
    throw error;
  }
};

export const jwtAccessVerify = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY);
    return decoded;
  } catch (error) {
    throw error;
  }
};

export const jwtRefresh = (user, res) => {
  try {
    const Token = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_KEY, {
      expiresIn: "7d",
    });
    res.cookie("$INVTOKEN", Token, {
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  } catch (error) {
    throw error;
  }
};

export const jwtRefreshVerify = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_KEY);
    return decoded;
  } catch (error) {
    throw error;
  }
};

export const jwtTemp = (user) => {
  try {
    const Token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_TEMP_TOKEN,
      { expiresIn: "5m" }
    );
    return Token;
  } catch (error) {
    throw error;
  }
};

export const jwtTempVerify = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_TEMP_TOKEN);
    return decoded;
  } catch (error) {
    throw error;
  }
};
