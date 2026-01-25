import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const genToken = (id) => {
  return jwt.sign(id, process.env.jwt_key, {
    expiresIn: "3h",
  });
};

export const comparePass = (inputPass, dbPass) => {
  return bcrypt.compare(inputPass, dbPass);
};
