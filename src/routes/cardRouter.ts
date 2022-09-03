import { Router } from "express";
import { activateCard, createCard } from "../controllers/cardController.js";
import { verifyActivateCard, verifyCreateCard } from "../middlewares/cardMiddleware.js";

const router: Router = Router();

router.post("/card/create/:employeeId", verifyCreateCard, createCard);
router.patch("/card/activate/:id", verifyActivateCard , activateCard);

export default router;