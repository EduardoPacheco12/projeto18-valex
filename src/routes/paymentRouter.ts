import { Router } from "express";
import { paymentPOS } from "../controllers/paymentController.js";
import { verifyPaymentPOS } from "../middlewares/paymentMiddleware.js";

const router: Router = Router();

router.post("/payments/POS", verifyPaymentPOS, paymentPOS);

export default router;