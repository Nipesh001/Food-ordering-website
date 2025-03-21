import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import config from "../config.js";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Admin } from "../models/admin.model.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const adminSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });
  const { error } = adminSchema.safeParse(req.body); // safeParse is used to prevent errors from being thrown
  if (error) {
    return res.status(400).json({ message: error.issues[0].message });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingAdmin = await Admin.findOne({ email: email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const newAdmin = await Admin.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    res
      .status(201)
      .json({ message: "User signup successfully", admin: newAdmin });
  } catch (error) {
    console.log("Error in signup user", error);
    return res.status(500).json({ message: "Error in signup admin" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email: email });
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!admin || !isValidPassword) {
      return res.status(403).json({ message: "Invalid username or password" });
    }

    //jwt code
    const token = jwt.sign({ id: admin._id }, config.JWT_ADMIN_PASSWORD, {
      expiresIn: "1d",
    });
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true, // prevents client side js from accessing the cookie
      secure: process.env.NODE_ENV === "production", // cookie will only be sent over https
      sameSite: "strict", // prevents CSRF attacks
    };
    res.cookie("jwt", token, cookieOptions); // set the cookie

    res.status(200).json({ message: "Admin login successfully", admin, token });
  } catch (error) {
    console.log("Error in login admin", error);
    return res.status(500).json({ message: "Error in login admin" });
  }
};

export const logout = async (req, res) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(401).json({ message: "You are not logged in" });
    }
    res.clearCookie("jwt");
    res.status(200).json({ message: "Admin logout successfully" });
  } catch (error) {
    console.log("Error in logout admin", error);
    return res.status(500).json({ message: "Error in logout admin" });
  }
};
  