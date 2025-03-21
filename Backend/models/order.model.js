import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  email: String,
  userId: String,
  foodId: String,
  paymentId: String,
  amount: Number,
  status: String,
});
export const Order = mongoose.model("Order", orderSchema);
