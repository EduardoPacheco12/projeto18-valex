import { Router } from "express";
import { createCard } from "../controllers/cardController.js";
import { verifyCreateCard } from "../middlewares/cardMiddleware.js";

const router: Router = Router();

router.post("/card/create/:employeeId", verifyCreateCard, createCard);

export default router;