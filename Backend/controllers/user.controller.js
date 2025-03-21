import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import config from "../config.js";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { Purchase } from "../models/purchase.model.js";
import { Food } from "../models/food.model.js";

export const signup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const userSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
  });
  const validatedData = userSchema.safeParse(req.body);
  if (!validatedData.success) {
    return res
      .status(400)
      .json({ errors: validatedData.error.issues.map((err) => err.message) });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ errors: "User already exists" });
    }
    const newUser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User signup successfully", user: newUser });
  } catch (error) {
    console.log("Error in signup user", error);
    return res.status(500).json({ message: "Error in signup user" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!user || !isValidPassword) {
      return res.status(400).json({ errors: "Invalid username or password" });
    }

    //jwt code
    const token = jwt.sign({ id: user._id }, process.env.JWT_USER_PASSWORD, {
      expiresIn: "1d",
    });
    const cookieOptions = {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      httpOnly: true, // prevents client side js from accessing the cookie
      secure: process.env.NODE_ENV === "production", // cookie will only be sent over https
      sameSite: "strict", // prevents CSRF attacks
    };
    res.cookie("jwt", token, cookieOptions); // set the cookie

    res.status(200).json({ message: "User login successfully", user, token });
  } catch (error) {
    console.log("Error in login user", error);
    return res.status(500).json({ errors: "Error in login user" });
  }
};

export const logout = async (req, res) => {
  try {
    if (!req.cookies.jwt) {
      return res.status(401).json({ message: "You are not logged in" });
    }
    res.clearCookie("jwt");
    res.status(200).json({ message: "User logout successfully" });
  } catch (error) {
    console.log("Error in logout user", error);
    return res.status(500).json({ message: "Error in logout user" });
  }
};

export const purchases = async (req, res) => {
  const userId = req.userId;

  try {
    const purchase = await Purchase.find({ userId: userId });
    let purchasedFoodId = [];

    for (let i = 0; i < purchase.length; i++) {
      purchasedFoodId.push(purchase[i].foodId);
    }
    const foodData = await Food.find({ _id: { $in: purchasedFoodId } }); // find all food items that are in the purchasedFoodId array
    res
      .status(200)
      .json({ message: "User purchase successfully", purchase, foodData });
  } catch (error) {
    console.log("Error in purchase product", error);
    return res.status(500).json({ message: "Error in purchase product" });
  }
};
