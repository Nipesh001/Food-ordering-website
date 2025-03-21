import mongoose from "mongoose";

const purchaseSchema = new mongoose.Schema({
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true

  },
  foodId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Food',
    required: true
  }
});
export const Purchase = mongoose.model("Purchase", purchaseSchema);

