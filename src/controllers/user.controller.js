import { encryptPassword } from "../helpers/encryptPassword.js";
import { generateToken } from "../helpers/generateToken.js";
import { response } from "../helpers/response.js";
import { orderModel } from "../models/order.model.js";
import { userModel } from "../models/user.model.js";

const userCtrl = {};

userCtrl.listById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);

    // Validar si el registro exite
    if (!user) {
      return response(res, 404, false, "", "El usuario no existe.");
    }

    const facturaAsociada = await orderModel.find({ user: id });

    response(
      res,
      200,
      true,
      { ...user.toJSON(), facturaAsociada, password: null },
      "Usuario encontrado exitosamente."
    );
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

userCtrl.register = async (req, res) => {
  try {
    const { email, password, name, lastname } = req.body;

    const user = await userModel.findOne({ email });
    if (user) {
      return response(
        res,
        409,
        false,
        "",
        "La dirección de correo electrónico ya está siendo usada por alguien más."
      );
    }

    const passwordEncrypt = encryptPassword(password);

    const newUser = new userModel({
      email,
      password: passwordEncrypt,
      name,
      lastname,
    });

    await newUser.save();

    const token = generateToken({ user: newUser._id });

    response(
      res,
      201,
      true,
      { ...newUser.toJSON(), password: null, token },
      "El usuario ha sido creado con éxito."
    );
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

// Función para loguearse
userCtrl.login = async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await userModel.findOne({ email });

    if (user && user.matchPassword(password)) {
      const token = generateToken({ user: user._id });
      return response(
        res,
        200,
        true,
        { ...user.toJSON(), password: null, token },
        "Bienvenida(o)"
      );
    }

    response(
      res,
      400,
      false,
      "",
      "Las credenciales no son correctas, inténtalo de nuevo."
    );
  } catch (error) {
    response(res, 500, false, "", error.message);
  }
};

export default userCtrl;
