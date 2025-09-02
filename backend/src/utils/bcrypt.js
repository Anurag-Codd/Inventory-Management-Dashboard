import { randomInt } from "node:crypto";
import bcrypt from "bcrypt";

export const genOTP = (req, res) => {
  return randomInt(100000, 1000000).toString();
};

export const bcryptHash = async (value, salt) => {
  return await bcrypt.hash(value, salt);
};

export const bcryptCompare = async (normal, hashed) => {
  return await bcrypt.compare(normal, hashed);
};
