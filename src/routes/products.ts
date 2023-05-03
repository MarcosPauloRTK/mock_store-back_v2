import Express from "express"
import * as productController from "../controller/productsController"
export const router = Express.Router()

router.get("/")