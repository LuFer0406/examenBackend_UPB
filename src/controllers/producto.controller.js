import {
  deleteImageCloudinary,
  uploadImageToCloudinary,
} from "../helpers/cloudinary.accions.js";
import { response } from "../helpers/Response.js";
import { categoryModel } from "../models/category.model.js";
import { orderModel } from "../models/order.model.js";
import { productModel } from "../models/producto.model.js";

const productCtrl = {};

productCtrl.listar = async (req, res) => {
  try {
    console.log(req.userId);
    const products = await productModel
      .find()
      .populate("user", { password: 0 })
      .populate("category")
      .sort("-createdAt");
    response(res, 200, true, products, "Lista de productos.");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

productCtrl.listOne = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return response(res, 404, false, "", "El producto no existe.");
    }
    response(
      res,
      200,
      true,
      product,
      "El producto ha sido encontrado con éxito."
    );
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

productCtrl.add = async (req, res) => {
  try {
    const { name, description, rate, category, public_id, price, stock } =
      req.body;

    const productocate = await categoryModel.findById(req.body.category);

    const num = parseInt(rate);

    if (num < 0 || num > 5) {
      return response(
        res,
        409,
        false,
        "",
        "Ingresaste un valor no válido en rate (1-5), inténtalo de nuevo."
      );
    }

    if (!productocate) {
      return response(
        res,
        404,
        false,
        "",
        "La categoría no existe, inténtalo de nuevo."
      );
    }

    const newProduct = new productModel({
      name,
      description,
      rate,
      category,
      public_id,
      price,
      stock,
      user: req.userId,
    });

    if (req.file) {
      const { secure_url, public_id } = await uploadImageToCloudinary(req.file);
      newProduct.setImg({ secure_url, public_id });
    }
    await productModel.create(newProduct);
    response(
      res,
      201,
      true,
      newProduct,
      "El producto ha sido creado con éxito."
    );
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

productCtrl.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    const facturarelacionada = await orderModel.findOne({ product: id });

    if (!product) {
      return response(
        res,
        404,
        false,
        "",
        "El producto no existe, inténtalo de nuevo."
      );
    }

    if (!facturarelacionada) {
      if (product.public_id) {
        await deleteImageCloudinary(product.public_id);
      }

      await product.deleteOne();

      return response(res, 200, true, "", "El producto ha sido eliminado con éxito.");
    }

    response(
      res,
      401,
      false,
      "",
      "Este producto no se puede eliminar ya que hay facturas activas relacionadas a este."
    );

    // if (product.public_id) {
    //   await deleteImageCloudinary(product.public_id);
    // }

    // await product.deleteOne();

    // response(res, 200, true, "", "El producto ha sido eliminado con éxito.");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

productCtrl.update = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);
    const { rate } = req.body;
    const productocate = await categoryModel.findById(req.body.category);
    const num = parseInt(rate);

    if (!product) {
      return response(res, 404, false, "", "El producto no existe.");
    }

    if (!productocate) {
      return response(
        res,
        404,
        false,
        "",
        "La categoría no existe, inténtalo de nuevo."
      );
    }

    if (num < 0 || num > 5) {
      return response(
        res,
        409,
        false,
        "",
        "Ingresaste un valor no válido en rate (1-5), inténtalo de nuevo."
      );
    }

    if (req.file) {
      if (product.public_id) {
        await deleteImageCloudinary(product.public_id);
      }

      const { secure_url, public_id } = await uploadImageToCloudinary(req.file);
      product.setImg({ secure_url, public_id });

      await product.save();
    }

    await product.updateOne(req.body);

    response(res, 200, true, "", "El producto ha sido actualizado con éxito.");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

export default productCtrl;
