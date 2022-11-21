import { Router } from "express";
import { authClient } from "../middleware/auth.js";
import { validFields } from "../middleware/ValidFields.js";
import { body } from "express-validator";
import orderCtrl from "../controllers/order.controller.js";

const route = Router();

route.get("/", orderCtrl.list);
route.get("/:id", orderCtrl.listOne);
route.delete("/:id", authClient, orderCtrl.delete);
route.put("/:id", authClient, orderCtrl.update);
route.post(
  "/",
  authClient,
  [
    body("product", "el campo 'product' es obligatorio")
      .optional({ checkFalsy: true })
      .notEmpty(),

    body("quantity", "el campo 'quantity' es obligatorio")
      .optional({ checkFalsy: true })
      .notEmpty(),
  ],
  validFields,
  orderCtrl.add
);

export default route;
