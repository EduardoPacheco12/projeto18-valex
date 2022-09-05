import { activateCardSchema, createCardSchema, lockCardSchema, rechargeCardSchema } from "../schemas/CardSchemas.js";
import { Request, Response, NextFunction } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";

interface createCardBody {
    type: TransactionTypes
}

interface activateCardBody {
    securityCode: string,
    password: string
}

type lockCardBody = Omit<activateCardBody, "securityCode">

export async function verifyCreateCard(req: Request<{ employeeId: string }, {}, { type: TransactionTypes }>, res: Response, next: NextFunction) {
    const apiKey: string | string[] | undefined = req.headers["x-api-key"];
    const body: createCardBody = req.body;

    if(!apiKey) {
        return res.status(401).send("API key not found");
    }

    const { error } = createCardSchema.validate(body, {abortEarly: false});
    if (error) {
        return res.status(422).send(error.details);
    }

    next()
}

export async function verifyActivateCard(req: Request, res: Response, next: NextFunction) {
    const body: activateCardBody = req.body;

    const { error } = activateCardSchema.validate(body, {abortEarly: false});
    if (error) {
        return res.status(422).send(error.details);
    }
    next();
}

export async function verifyLockCard(req: Request, res: Response, next: NextFunction) {
    const body: lockCardBody = req.body;

    const { error } = lockCardSchema.validate(body, {abortEarly: false});
    if (error) {
        return res.status(422).send(error.details);
    }
    next();
}

export async function verifyRechargeCard(req: Request, res: Response, next: NextFunction) {
    const body = req.body;
    const apiKey: string | string[] | undefined = req.headers["x-api-key"];

    if(!apiKey) {
        return res.status(401).send("API key not found");
    }

    const { error } = rechargeCardSchema.validate(body, {abortEarly: false});
    if (error) {
        return res.status(422).send(error.details);
    }

    next();
}