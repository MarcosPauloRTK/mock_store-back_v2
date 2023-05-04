import Express from "express";
import categoriesController from "../../../controller/categories";
const router = Express.Router();

router.get("/", categoriesController.index);
router.delete("/", categoriesController.remove);
router.post("/", categoriesController.insert);

export default router;
