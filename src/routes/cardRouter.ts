import { Router } from "express";
import { activateCard, createCard, getBalance, lockUnlockCard, rechargeCard } from "../controllers/cardController.js";
import { verifyActivateCard, verifyCreateCard, verifyLockCard, verifyRechargeCard } from "../middlewares/cardMiddleware.js";

const router: Router = Router();

router.post("/card/create/:employeeId", verifyCreateCard, createCard);
router.patch("/card/activate/:cardId", verifyActivateCard , activateCard);
router.get("/card/balance/:cardId", getBalance);
router.patch("/card/lock/:cardId", verifyLockCard, lockUnlockCard("lock"));
router.patch("/card/unlock/:cardId", verifyLockCard, lockUnlockCard("unlock"));
router.post("/card/recharge/:cardId", verifyRechargeCard, rechargeCard);

export default router;