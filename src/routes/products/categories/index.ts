import Express from "express";
import categoriesController from "../../../controller/categories";
const router = Express.Router();

router.get("/", categoriesController.index);
router.post("/", categoriesController.insert);
router.delete("/:category", categoriesController.remove);

export default router;
