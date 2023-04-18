import Express from "express";
import * as controller from "../../controllers/categoryController";

export const router = Express.Router();
router.get("/", controller.index);
