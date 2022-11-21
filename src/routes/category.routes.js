import { Router } from "express";
import categoryCtrl from "../controllers/category.controller.js";
import { authClient } from "../middleware/auth.js";
import { upload } from "../middleware/imgUpload.js";
import { validFields } from "../middleware/ValidFields.js";
import { body } from 'express-validator'


const route = Router();

route.get("/", categoryCtrl.list);
route.get("/:id", categoryCtrl.listOne);
route.delete("/:id", authClient, categoryCtrl.delete);
route.put("/:id", authClient, upload.single("img"), categoryCtrl.update);
route.post('/', authClient, [

    body("title", "el campo title es obligatorio").optional({ checkFalsy: true })
    .notEmpty(),

    body("description", "el campo description es obligatorio").optional({ checkFalsy: true })
    .notEmpty(),

], validFields, upload.single("img"), categoryCtrl.add)


export default route;