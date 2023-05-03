import Express from "express"
import categoryController from "../controller/categoriesController"
import productController from "../controller/productsController"
const router = Express.Router()

router.get("/", categoryController.index)
router.delete("/", categoryController.remove)

router.get("/:category", productController.indexCategory)

export default router;