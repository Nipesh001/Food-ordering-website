import { Food } from "../models/food.model.js";
import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/user.model.js";
import { Purchase } from "../models/purchase.model.js";
import Stripe from "stripe";
import config from "../config.js";

export const createFood = async (req, res) => {
  const adminId = req.adminId;

  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  // const image = req.body.image;

  console.log(title, description, price);

  try {
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "Please fill in all fields" });
    }

    const { image } = req.files; // get the image from the request
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ errors: "Please upload an image" });
    }

    const allowedFormat = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedFormat.includes(image.mimetype)) {
      return res.status(400).json({ errors: "Please upload a valid image" });
    }

    //claudinary upload
    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);

    if (!cloud_response || cloud_response.error) {
      return res.status(400).json({ errors: "Failed to upload image" });
    }

    // delete the image from the temp folder
    // await fs.unlink(image.tempFilePath);

    const foodData = {
      title,
      description,
      price,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.url,
      },
      creatorId: adminId,
    };
    const food = await Food.create(foodData);
    res.json({
      message: "Food created successfully",
      food,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateFood = async (req, res) => {
  const adminId = req.adminId;
  const { foodId } = req.params;
  const { title, description, price, image } = req.body;
  try {
    const findFood = await Food.findById(foodId);
    if (!findFood) {
      return res.status(404).json({ errors: "Food not found" });
    }
    const food = await Food.findOneAndUpdate(
      {
        _id: foodId,
        creatorId: adminId,
      },
      {
        title,
        description,
        price,
        image: {
          public_id: image?.public_id,
          url: image?.url,
        },
      }
    );
    if (!food) {
      return res
        .status(404)
        .json({ errors: "can't update, created by other admin" });
    }
    console.log(food)
    res.status(201).json({ message: "food updated successfully", food });
  } catch (error) {
    res.status(500).json({ messege: "Error updating food" });
    console.log("Error in food update", error);
  }
};

export const deleteFood = async (req, res) => {
  const adminId = req.adminId;
  const { foodId } = req.params;
  try {
    const food = await Food.findOneAndDelete({
      _id: foodId,
      creatorId: adminId,
    });
    if (!food) {
      return res.status(404).json({ message: "can't delete created by other admin" });
    }
    res.status(200).json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting food" });
    console.log("Error in food delete", error);
  }
};

export const getFoods = async (req, res) => {
  try {
    const foods = await Food.find({});
    res.status(200).json({ foods });
  } catch (error) {
    res.status(500).json({ errors: "Error getting food" });
    console.log("Error in get food ", error);
  }
};

export const foodDetails = async (req, res) => {
  const { foodId } = req.params;
  try {
    const food = await Food.findById({ _id: foodId });
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    res.status(200).json({ food });
  } catch (error) {
    res.status(500).json({ message: "Error getting food details" });
    console.log("Error in food details", error);
  }
};

const stripe = new Stripe(config.STRIPE_SECRET_KEY);
console.log(config.STRIPE_SECRET_KEY);

export const buyFood = async (req, res) => {
  const { foodId } = req.params;
  const { userId } = req; // get user id from req
  try {
    const food = await Food.findById({ _id: foodId });
    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //stripe payment
    const amount = food.price;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

 
    res.status(200).json({
      message: "Food purchased successfully",
      food,
      clientSecret: paymentIntent.client_secret,
    });

 
  } catch (error) {
    res.status(500).json({ message: "Error buying food" });
    console.log("Error in buy food", error);
  }
};
