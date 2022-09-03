import joi from "joi";

export const createCardSchema = joi.object({
    type: joi.string().valid("groceries", "restaurant", "transport", "education", "health").required()
});