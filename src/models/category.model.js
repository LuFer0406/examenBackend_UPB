import mongoose from "mongoose";

const { Schema, model } = mongoose;

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El campo 'name' es requerido.'"],
    },
    description: {
      type: String,
      required: [true, "El campo 'description' es requerido.'"],
    },
    imgUrl: { type: String, default: null },

    public_id: String,
  },
  {
    timestamps: true,
  }
);

categorySchema.methods.setImg = function setImg({ secure_url, public_id }) {
  this.imgUrl = secure_url;
  this.public_id = public_id;
};

export const categoryModel = model("category", categorySchema);
