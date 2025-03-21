import { Order } from "../models/order.model.js";
import { Purchase } from "../models/purchase.model.js";

export const orderData = async (req, res) => {
  const order = req.body;

  try {
    const orderInfo = await Order.create(order);
    console.log(orderInfo);
    const userId = orderInfo?.userId;
    const foodId = orderInfo?.foodId;

    res.status(201).json({ message: "Order Details", orderInfo });

    if (orderInfo) {
      const newPurchase = new Purchase({
        userId,
        foodId,
      });
      await newPurchase.save();
    }
  } catch (error) {
    console.error("Error in order: ", error);
    return res.status(401).json({ message: "Error in order" });
  }
};
