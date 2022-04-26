import { userModel } from "../models/user.model.js";
import asynchandler from "express-async-handler";
import validator from "email-validator";
import { AuthToken } from "../utils/authToken.js";
import { sendGridEmail } from "../helpers/email.helper.js";
import jwt from "jsonwebtoken";

export const registerUser = asynchandler(async (req, res) => {
  const { username, email, password, profile, admin } = req.body;

  const ifUserExist = await userModel.findOne({ email });

  if (ifUserExist) {
    res.status(400);
    res.json({
      message: "email already exist check and try again",
    });
  }

  if (validator.validate(req.body.email)) {
    const user = await userModel.create({
      username,
      email,
      password,
      profile,
      admin,
    });
    const token = AuthToken(user._id);
    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        admin: user.admin,
        profile: user.profile,
        token: token,
      });
    } else {
      res.status(500).json({
        message:
          "an error occurred while processing your request, please try again ",
      });
    }
  } else {
    res.status(404);
    res.json({
      message: "email type not supported",
    });
  }
});

export const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    res.status(400);
    res.json({ message: "user not found" });
  } else if (user && (await user.comparePassword(password))) {
    res.status(200);
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profile: user.profile,
      admin: user.admin,
      token: AuthToken(user._id),
    });
    console.log("user logged in successfully");
  } else {
    res.status(400);
    res.json({ message: "wrong password" });
  }
});

export const resetUserPassword = asynchandler(async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    res.status(404);
    res.json({ message: "the email provided was not found" });
  } else if (user) {
    const token = AuthToken(user._id);
    try {
      await sendGridEmail.sendResetPasswordEmail(user.email, token, user._id);
      res.status(200);
      res.json({
        message: `a link to reset your password has been sent to: ${user.email}`,
      });
    } catch (error) {
      res.status(500);
      res.json({ message: error });
    }
  } else {
    res.status(500);
    res.json({ message: "Internal Server Error" });
  }
});

export const saveResetPassword = asynchandler(async (req, res) => {
  const { id, authorization } = req.params;

  const user = await userModel.findById(req.params.id);
  const private_key = process.env.PRIVATE_KEY;
  const payload = jwt.verify(authorization, private_key);
  console.log(payload)
  console.log(user)
  console.log(id)
  if (user._id === id || payload.id){
    try {
      user.password = req.body.password;
      await user.save();
      await authorization.delete();
      res.status(200);
      res.json({ message: "password changed successfully" });
    } catch (error) {
      res.status(404);
      res.json({ message: `an error occured: ${error}` });
    }
  } else {
    res.status(500);
    res.json({ message: "password resent link invalid or has expired" });
  }
});
