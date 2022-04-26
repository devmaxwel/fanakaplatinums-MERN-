import jwt from "jsonwebtoken";

export const AuthToken = (id) => {
  const private_key = process.env.PRIVATE_KEY;
  return jwt.sign({ id }, private_key, {
    expiresIn: "15m",
  });
};
