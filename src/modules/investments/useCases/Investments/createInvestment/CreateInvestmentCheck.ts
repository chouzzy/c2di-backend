import { ValidationError } from "yup";
import { validationResponse } from "../../../../../types";
import { CreateInvestmentRequestProps } from "./CreateInvestmentController";
import { createInvestmentSchema } from "./CreateInvestmentSchema";




async function checkBody(investmentData: CreateInvestmentRequestProps) {
    // check body properties
    try {
        await createInvestmentSchema.validate(investmentData, {
            abortEarly: false,
        })
        return
    }
    catch (error) {
        throw error
    }
}
export { checkBody }



