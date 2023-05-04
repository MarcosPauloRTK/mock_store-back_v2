import Express from "express";
import categoryController from "../../../controller/category";
const router = Express.Router();

router.get("/:category", categoryController.show);

export default router;
