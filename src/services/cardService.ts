import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js";
import Cryptr from "cryptr";
import bcrypt from 'bcrypt';
import * as cardRepository from "../repositories/cardRepository.js";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as rechargeRepository from "../repositories/rechargeRepository.js";
dayjs.extend(customParseFormat);
dayjs.extend(isSameOrBefore);

const cryptr: Cryptr = new Cryptr(process.env.SECRET);

function formatName(nameArray: string[]) {
    const newNameArray: string[] = nameArray.filter((value: string) => value.length > 2);
    let nameFormat: string = "";
    for(let i = 0; i < newNameArray.length; i++) {
        if(i === 0) {
            nameFormat += `${newNameArray[i]} `
        }
        if(i === newNameArray.length - 1) {
            nameFormat += `${newNameArray[i]}`
        }
        if(i !== 0 && i !== newNameArray.length - 1 ) {
            nameFormat += `${newNameArray[i][0]} `
        }
    }
    return nameFormat.toUpperCase();
}

export async function createCard(type: cardRepository.TransactionTypes, employeeId: number ,apiKey: string | string[]) {

    const verifyCompany = await companyRepository.findByApiKey(apiKey);
    if(!verifyCompany) {
        throw { type: "companyNotFound" , message: "API key doesn't belong to a company" };
    }

    const verifyEmployee = await employeeRepository.findById(employeeId);
    if(!verifyEmployee) {
        throw { type: "employeeNotFound", message: "Unregistered employee" };
    }

    const verifyTypeAndEmployee = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
    if(verifyTypeAndEmployee) {
        throw { type: "cardSameType", message: "this employee already has a card of this type"}
    }

    const nameArray: string[] = (verifyEmployee.fullName).split(" ");
    const cardholderName: string = formatName(nameArray);
    const number: string = faker.finance.creditCardNumber();
    const expirationDate: string = dayjs().add(5, "year").format("MM/YY");
    const securityCode: string = faker.finance.creditCardCVV();
    console.log(securityCode);
    const encryptedSecurityCode: string = cryptr.encrypt(securityCode);

    const card: cardRepository.CardInsertData = {
        employeeId,
        number,
        cardholderName,
        securityCode: encryptedSecurityCode,
        expirationDate,
        password: undefined,
        isVirtual: false,
        originalCardId: undefined,
        isBlocked: false,
        type
    }
    await cardRepository.insert(card);
}

export async function activateCard( securityCode: string, password: string, cardId: number) {
    const verifyCard: cardRepository.Card = await cardRepository.findById(cardId);
    if(!verifyCard) {
        throw { type: "cardNotFound", message: "Unregistered card" };
    }

    const expirationDate = dayjs(verifyCard.expirationDate, "MM/YY");
    const today = dayjs(dayjs(),"MM/YY")
    const result: boolean = today.isSameOrBefore(expirationDate, "month");
    if(!result) {
        throw { type: "cardExpired", message: "This card is expired" };
    }

    if(verifyCard.password !== null) {
        throw { type: "cardActive", message: "This card is already Activate" };
    } 

    const decryptedSecurityCode: string = cryptr.decrypt(verifyCard.securityCode)
    if(securityCode !== decryptedSecurityCode) {
        throw { type: "securityCodeError", message: "Your security code is invalid" }
    }

    const encryptedPassword: string = bcrypt.hashSync(password, 10);

    await cardRepository.update(cardId, { password: encryptedPassword });
}

export async function lockUnlockCard(password: string, cardId: number, Lock: boolean) {
    const verifyCard: cardRepository.Card = await cardRepository.findById(cardId);
    if(!verifyCard) {
        throw { type: "cardNotFound", message: "Unregistered card" };
    }

    const expirationDate = dayjs(verifyCard.expirationDate, "MM/YY");
    const today = dayjs(dayjs(),"MM/YY")
    const result: boolean = today.isSameOrBefore(expirationDate, "month");
    if(!result) {
        throw { type: "cardExpired", message: "This card is expired" };
    }

    const verifyPassword: boolean = bcrypt.compareSync(password, verifyCard.password);
    if(!verifyPassword) {
        throw { type: "passwordError", message: "Your password is incorrect"}
    }

    if(Lock === true) {
        if(verifyCard.isBlocked === true) {
            throw { type: "lockError", message: "The card is already locked" }
        }
        await cardRepository.update(cardId, { isBlocked: true });
    }
    if(Lock === false) {
        if(verifyCard.isBlocked === false) {
            throw { type: "unlockError", message: "The card is already unlocked" }
        }
        await cardRepository.update(cardId, { isBlocked: false });
    }

}

export async function rechargeCard(amount: number, cardId: number, apiKey: string | string[]) {
    const verifyCompany = await companyRepository.findByApiKey(apiKey);
    if(!verifyCompany) {
        throw { type: "companyNotFound" , message: "API key doesn't belong to a company" };
    }

    const verifyCard: cardRepository.Card = await cardRepository.findById(cardId);
    if(!verifyCard) {
        throw { type: "cardNotFound", message: "Unregistered card" };
    }

    if(!(verifyCard.password)) {
        throw { type: "cardNotActive", message: "Card is not active" };
    }

    const expirationDate = dayjs(verifyCard.expirationDate, "MM/YY");
    const today = dayjs(dayjs(),"MM/YY")
    const result: boolean = today.isSameOrBefore(expirationDate, "month");
    if(!result) {
        throw { type: "cardExpired", message: "This card is expired" };
    }

    const rechargeData: rechargeRepository.RechargeInsertData = {
        cardId,
        amount
    }
    await rechargeRepository.insert(rechargeData);

}