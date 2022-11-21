import mongoose from "mongoose";

const { Schema, model } = mongoose

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "El campo name es obligatorio"]
    },
    description: {
        type: String,
        required: [true, "El campo description es obligatorio"]
    },
    rate: {
        type: Number,
        required: [true, "El campo rate es obligatorio"]
    },
    category: {
        type: Schema.Types.ObjectId,
        required: [true, "El campo category es obligatorio"],
        ref: "category"
    },
    imgUrl: {
        type: String,
        required: [true, "El campo imgUrl es obligatorio"]
    },

    public_id: String,

    user: {
        type: Schema.Types.ObjectId,
        required: [true, "El campo user es obligatorio"],
        ref: "user"
    },

    price: {
        type: Number,
        required: [true, "El campo price es obligatorio"]
    },

    stock: {
        type: Number,
        required: [true, "El campo stock es obligatorio"]
    },

}, {
    timestamps: true
})

productSchema.methods.setImg = function setImg({ secure_url, public_id }) {
    this.imgUrl = secure_url
    this.public_id = public_id
}

export const productModel = model("product", productSchema)