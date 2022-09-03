import { faker } from "@faker-js/faker";
import dayjs from "dayjs";
import Cryptr from "cryptr";
import { CardInsertData, findByTypeAndEmployeeId, insert, TransactionTypes } from "../repositories/cardRepository.js";
import { findByApiKey } from "../repositories/companyRepository.js"
import { findById } from "../repositories/employeeRepository.js";

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

export async function createCard(type: TransactionTypes, employeeId: number ,apiKey: string | string[]) {

    const verifyCompany = await findByApiKey(apiKey);
    if(!verifyCompany) {
        throw { type: "companyNotFound" , message: "API key doesn't belong to a company" };
    }

    const verifyEmployee = await findById(employeeId);
    if(!verifyEmployee) {
        throw { type: "employeeNotFound", message: "Unregistered employee" };
    }

    const verifyTypeAndEmployee = await findByTypeAndEmployeeId(type, employeeId);
    if(verifyTypeAndEmployee) {
        throw { type: "cardSameType", message: "this employee already has a card of this type"}
    }

    const nameArray: string[] = (verifyEmployee.fullName).split(" ");
    const cardholderName: string = formatName(nameArray);
    const number: string = faker.finance.creditCardNumber();
    const expirationDate: string = dayjs().add(5, "year").format("MM/YY");
    const securityCode: string = faker.finance.creditCardCVV();
    const cryptr = new Cryptr(process.env.SECRET);
    const encryptedSecurityCode: string = cryptr.encrypt(securityCode);

    const card: CardInsertData = {
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
    await insert(card);
    return;
}