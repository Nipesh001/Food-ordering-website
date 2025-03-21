import express from "express";
import {
  buyFood,
  createFood,
  deleteFood,
  foodDetails,
  getFoods,
  updateFood,
} from "../controllers/food.controller.js";
import userMiddleware from "../middlewares/user.mid.js";
import adminMiddleware from "../middlewares/admin.mid.js";

const router = express.Router();

router.post("/create", adminMiddleware, createFood);
router.put("/update/:foodId", adminMiddleware, updateFood);
router.delete("/delete/:foodId", adminMiddleware, deleteFood);

router.get("/foods", getFoods);
router.get("/:foodId", foodDetails);

router.post("/buy/:foodId", userMiddleware, buyFood);

export default router;
