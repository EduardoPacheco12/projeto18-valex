import { Request, Response } from "express";
import { TransactionTypes } from "../repositories/cardRepository.js";
import * as cardService from "../services/cardService.js";

export async function createCard(req: Request<{ employeeId: string }, {}, { type: TransactionTypes }>, res: Response) {
    const { type } = req.body;
    const employeeId: number = Number(req.params.employeeId);
    const apiKey: string | string[] = req.headers["x-api-key"];

    try {
        await cardService.createCard(type, employeeId, apiKey);
        res.sendStatus(201);
    } catch (error) {
        if(error.type === "companyNotFound" || "employeeNotFound") {
            return res.status(404).send(error.message);
        }
        if(error.type === "cardSameType") {
            return res.status(401).send(error.message);
        }

        res.status(400).send(error);
    }
}

export async function activateCard(req: Request, res: Response) {
    const password: string = req.body.password;
    const securityCode : string  = req.body.securityCode;
    const cardId: number = Number(req.params.id);

    try {
        await cardService.activateCard(securityCode, password, cardId)
        res.sendStatus(200);   
    } catch (error) {
        if(error.type === "cardNotFound") {
            return res.status(404).send(error.message);
        }
        if(error.type === "cardExpired" || "cardActive" || "securityCodeError") {
            return res.status(401).send(error.message);
        }
        res.status(400).send(error);
    }

}