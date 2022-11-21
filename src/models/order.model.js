import mongoose from "mongoose";

const { Schema, model } = mongoose;

const orderSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      required: [true, "El campo 'product' es obligatorio"],
      ref: "product",
    },
    quantity: {
      type: Number,
      required: [true, "El campo 'quantity' es obligatorio"],
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, "El campo 'user' es obligatorio"],
      ref: "user",
    },
    total: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const orderModel = model("order", orderSchema);
