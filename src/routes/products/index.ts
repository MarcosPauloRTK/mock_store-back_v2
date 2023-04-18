import Express from "express";
import * as controller from "../../controllers/productController";

export const router = Express.Router();

router.get("/", controller.index);
router.get("/:id", controller.show);
