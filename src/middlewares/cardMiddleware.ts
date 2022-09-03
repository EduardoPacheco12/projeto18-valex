import { activateCardSchema, createCardSchema } from "../schemas/CardSchemas.js";
import { Request, Response, NextFunction } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";

interface createCardBody {
    type: TransactionTypes
}

interface activateCardBody {
    securityCode: string,
    password: string
}

export async function verifyCreateCard(req: Request<{ employeeId: string }, {}, { type: TransactionTypes }>, res: Response, next: NextFunction) {
    const apiKey: string | string[] | undefined = req.headers["x-api-key"];
    const body: createCardBody = req.body;

    if(!apiKey) {
        return res.sendStatus(401);
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