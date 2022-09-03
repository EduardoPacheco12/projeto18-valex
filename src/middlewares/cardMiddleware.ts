import { createCardSchema } from "../schemas/CardSchemas.js";
import { Request, Response, NextFunction } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";

interface body {
    type: TransactionTypes
}

export async function verifyCreateCard(req: Request<{ employeeId: string }, {}, { type: TransactionTypes }>, res: Response, next: NextFunction) {
    const apiKey: string | string[] | undefined = req.headers["x-api-key"];
    const body: body = req.body;

    if(!apiKey) {
        return res.sendStatus(401);
    }

    const { error } = createCardSchema.validate(body, {abortEarly: false});
    if (error) {
        return res.status(422).send(error.details);
    }

    next()
}