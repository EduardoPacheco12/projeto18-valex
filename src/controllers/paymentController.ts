import { Request, Response } from "express";
import * as paymentService from "../services/paymentService.js";

export async function paymentPOS(req: Request, res: Response) {
    const businessId: number = req.body.businessId;
    const cardId: number = req.body.cardId;
    const amount: number = req.body.amount;
    const password: string = req.body.password;

    try {
        await paymentService.paymentPOS(businessId, cardId, amount, password);
        return res.sendStatus(200);
    } catch (error) {
        if (error.type === "cardNotFound" || "businessNotFound") {
            return res.status(404).send(error.message);
        }
        if (error.type === "cardNotActive" || "cardExpired" || "cardBlocked" || "passwordError" || "sameTypeError" || "balanceError") {
            return res.status(401).send(error.message);
        }
        return res.status(400).send(error);
    }
}