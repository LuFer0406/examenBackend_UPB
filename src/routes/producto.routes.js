import { Router } from 'express'
import productCtrl from '../controllers/producto.controller.js'
import { upload } from '../middleware/imgUpload.js'
import { body } from 'express-validator'
import { validFields } from '../middleware/ValidFields.js'
import { authClient } from '../middleware/auth.js'


const route=Router()

route.get('/',productCtrl.listar)
route.get('/:id',productCtrl.listOne)

route.post('/',authClient,[

    body("name","el campo name es obligatorio").optional({checkFalsy:true})
    .notEmpty(),

    body("description","el campo description es obligatorio").optional({checkFalsy:true})
    .notEmpty(),

] ,validFields,upload.single("img"),productCtrl.add)

route.delete('/:id',authClient,productCtrl.delete)

route.put('/:id',authClient,upload.single("img") ,productCtrl.update)

export default route;