import mongoose from "mongoose";
import { response } from "../helpers/Response.js";
import { orderModel } from "../models/order.model.js";
import { productModel } from "../models/producto.model.js";

const orderCtrl = {};

orderCtrl.list = async (req, res) => {
  try {
    console.log(req.userId);
    const facturaInfo = await orderModel
      .find()
      .populate("user", { password: 0 })
      .populate("product")
      .sort("-createdAt");
    response(res, 200, true, facturaInfo, "Lista de facturas");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

orderCtrl.listOne = async (req, res) => {
  try {
    const { id } = req.params;
    const facturaInfo = await orderModel.findById(id);

    if (!facturaInfo) {
      return response(
        res,
        404,
        false,
        "",
        "La factura no existe, inténtalo de nuevo."
      );
    }
    response(
      res,
      200,
      true,
      facturaInfo,
      "La factura ha sido encontrada con éxito."
    );
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

orderCtrl.add = async (req, res) => {
  try {
    const { product, quantity } = req.body;
    var { total } = orderModel;
    const creacionFactura = await productModel.findOne({ product });
    const producto = await productModel.findById(req.body.product);
    var stockProducto = producto.stock;

    if (!producto) {
      return response(
        res,
        404,
        false,
        "",
        "El producto referenciado no existe, inténtalo de nuevo."
      );
    }

    if (quantity > stockProducto) {
      return response(
        res,
        400,
        false,
        "",
        "No hay suficientes cantidades del producto en stock."
      );
    }

    total = producto.price * quantity;
    stockProducto = stockProducto - quantity;

    const newOrder = new orderModel({
      product,
      quantity,
      total,
      user: req.userId,
    });

    await producto.updateOne({ stock: stockProducto });
    await orderModel.create(newOrder);

    response(res, 201, true, newOrder, "La factura ha sido creada con éxito.");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

orderCtrl.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const factura = await orderModel.findById(id);
    const productoRelacionado = await productModel.findById(factura.product);

    if (!factura) {
      return response(
        res,
        404,
        false,
        "",
        "La factura no existe, inténtalo de nuevo."
      );
    }

    const stockNuevo = productoRelacionado.stock + factura.quantity;
    await productoRelacionado.updateOne({ stock: stockNuevo });
    await factura.deleteOne();

    response(res, 200, true, "", "La factura ha sido eliminada con éxito.");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

orderCtrl.update = async (req, res) => {
  try {
    const { id } = req.params;
    const factura = await orderModel.findById(id);
    const producto = await productModel.findById(factura.product);
    const { quantity } = req.body;
    const productoCompra = await productModel.findById(req.body.product);

    if (!factura) {
      return response(
        res,
        404,
        false,
        "",
        "La factura no existe, inténtalo de nuevo."
      );
    }

    if (!productoCompra) {
      return response(
        res,
        404,
        false,
        "",
        "El producto que deseas no existe, inténtalo de nuevo."
      );
    }

    if (quantity > productoCompra.stock) {
      return response(
        res,
        400,
        false,
        "",
        "No hay suficientes cantidades del producto en stock."
      );
    }

    const restaurarStock = producto.stock + factura.quantity;
    const stockNuevo =  productoCompra.stock - quantity;
    const totalNuevo = productoCompra.price * quantity;

    await producto.updateOne({ stock: restaurarStock });
    await productoCompra.updateOne({stock: stockNuevo})
    await factura.updateOne({total : totalNuevo})
    await factura.updateOne(req.body);

    response(res, 200, true, "", "La factura ha sido actualizada con éxito.");
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};
export default orderCtrl;
