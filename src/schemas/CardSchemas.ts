import joi from "joi";

export const createCardSchema = joi.object({
    type: joi.string().valid("groceries", "restaurant", "transport", "education", "health").required()
});

export const activateCardSchema = joi.object({
    securityCode: joi.string().pattern(new RegExp("^[0-9]{3}")).length(3).required(),
    password: joi.string().pattern(new RegExp("^[0-9]{4}")).length(4).required()
})

export const lockCardSchema = joi.object({
    password: joi.string().pattern(new RegExp("^[0-9]{4}")).length(4).required()
})

export const rechargeCardSchema = joi.object({
    amount: joi.number().min(1).required()
})