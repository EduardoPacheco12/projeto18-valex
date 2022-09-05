import joi from "joi";

export const paymentPosSchema = joi.object({
    businessId: joi.number().required(),
    cardId: joi.number().required(),
    amount: joi.number().min(1).required(),
    password: joi.string().pattern(new RegExp("^[0-9]{4}")).length(4).required()
});