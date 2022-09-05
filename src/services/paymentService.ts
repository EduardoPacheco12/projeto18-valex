import * as cardRepository from "../repositories/cardRepository.js";
import * as businessRepository from "../repositories/businessRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as paymentRepository from "../repositories/paymentRepository.js";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

export async function paymentPOS(businessId: number, cardId: number, amount: number, password: string) {
    const verifyCard: cardRepository.Card = await cardRepository.findById(cardId);
    if(!verifyCard) {
        throw { type: "cardNotFound", message: "Unregistered card" };
    }

    if(verifyCard.password === null) {
        throw { type: "cardNotActive", message: "Card is not active" };
    }

    const expirationDate = dayjs(verifyCard.expirationDate, "MM/YY");
    const today = dayjs(dayjs(),"MM/YY")
    const result: boolean = today.isSameOrBefore(expirationDate, "month");
    if(!result) {
        throw { type: "cardExpired", message: "This card is expired" };
    }

    if(verifyCard.isBlocked) {
        throw { type: "cardBlocked", message: "This card is locked" };
    }

    const verifyPassword: boolean = bcrypt.compareSync(password, verifyCard.password);
    if(!verifyPassword) {
        throw { type: "passwordError", message: "Your password is incorrect"}
    }

    const verifyBusiness: businessRepository.Business = await businessRepository.findById(businessId);
    if(!verifyBusiness) {
        throw { type: "businessNotFound", message: "Business not found" };
    }

    if(verifyCard.type !== verifyBusiness.type) {
        throw { type: "sameTypeError", message: "The card doesn't have the same type as the business"};
    }

    const recharges = await rechargeRepository.findByCardId(cardId);
    const totalRecharge: number = recharges.reduce((previousValue: number, currentValue: rechargeRepository.Recharge) => previousValue + currentValue.amount, 0);
    const payments = await paymentRepository.findByCardId(cardId);
    const totalPayments: number = payments.reduce((previousValue: number, currentValue: rechargeRepository.Recharge) => previousValue + currentValue.amount, 0);
    const balance: number = totalRecharge - totalPayments;
    if(balance < amount) {
        throw { type: "balanceError", message: "Failed to perform transaction" };
    }

    const paymentInsertData: paymentRepository.PaymentInsertData = {
        cardId,
        businessId,
        amount
    }

    await paymentRepository.insert(paymentInsertData);
}
