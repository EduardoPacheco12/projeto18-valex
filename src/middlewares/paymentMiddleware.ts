import { Request, Response, NextFunction } from "express";
import { paymentPosSchema } from "../schemas/PaymentSchemas.js";

interface paymentBody {
    businessId: number,
    cardId: number,
    amount: number,
    password: string
}

export async function verifyPaymentPOS(req: Request, res: Response, next: NextFunction) {
    const body: paymentBody = req.body;

    const { error } = paymentPosSchema.validate(body, {abortEarly: false});
    if (error) {
        return res.status(422).send(error.details);
    }

    next();
}