import {
  deleteImageCloudinary,
  uploadImageToCloudinary,
} from "../helpers/cloudinary.accions.js";
import { response } from "../helpers/response.js";
import { categoryModel } from "../models/category.model.js";
import { productModel } from "../models/producto.model.js";

const categoryCtrl = {};

categoryCtrl.list = async (req, res) => {
  try {
    const posts = await categoryModel.find().sort({ createdAt: -1 });
    response(res, 200, true, posts, "Lista de categorías.");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

categoryCtrl.listOne = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);

    // Validar si el registro exite
    if (!category) {
      return response(res, 404, false, "", "La categoría no existe.");
    }

    const products = await productModel.find({category: id})

    response(res, 200, true, {...category.toJSON(), products}, "Categoría encontrada exitosamente.");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

categoryCtrl.add = async (req, res) => {
  try {
    const { name, description } = req.body;

    const newCategory = new categoryModel({
      name,
      description,
      user: req.userId,
    });

    // Verificar la imagen -> Cloudinary
    if (req.file) {
      const { secure_url, public_id } = await uploadImageToCloudinary(req.file);
      newCategory.setImg({ secure_url, public_id });
    }

    await categoryModel.create(newCategory);

    response(res, 201, true, "", "Categoría creada");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

categoryCtrl.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);

    // Validar si existe el registro
    if (!category) {
      return response(res, 404, false, "", "La categoría no existe.");
    }

    // Validar si la categoría tiene productos
    
    const products = await productModel.findOne({category: id})

    if (!products) {
      if (category.public_id) {
        await deleteImageCloudinary(category.public_id);
      }

      await category.deleteOne();
      return response(res, 200, true, "", "categoria eliminada");
    }

    response(
      res,
      401,
      false,
      "",
      "esta categoría no se puede eliminar ya que contiene productos"
    );

  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

categoryCtrl.update = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await categoryModel.findById(id);

    // Validar si existe el registro
    if (!category) {
      return response(res, 404, false, "", "La categoría no existe.");
    }

    if (req.file) {
      // Validar -> Cloudinary
      if (category.public_id) {
        await deleteImageCloudinary(category.public_id);
      }

      const { secure_url, public_id } = await uploadImageToCloudinary(req.file);

      category.setImg({ secure_url, public_id });

      await category.save();
    }

    await category.updateOne(req.body);
    response(res, 200, true, "", "La categoría ha sido actualizada con éxito.");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

export default categoryCtrl;
