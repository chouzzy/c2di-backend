import { ValidationError } from "yup";
import { validationResponse } from "../../../../../types";
import { CreateInvestmentRequestProps } from "../../Investments/createInvestment/CreateInvestmentController";
import { createInvestmentSchema } from "../../Investments/createInvestment/CreateInvestmentSchema";
import { CreateUserProprietarioRequestProps } from "./CreateUserProprietarioController";
import { createUserProprietarioSchema } from "./CreateUserProprietarioSchema";




async function checkBody(investmentData: CreateUserProprietarioRequestProps): Promise<validationResponse> {
    // check body properties
    try {
        const yupValidation = await createUserProprietarioSchema.validate(investmentData, {
            abortEarly: false,
        })
        return { isValid: true, statusCode: 202 }
    }
    catch (error) {
        if (error instanceof ValidationError) {
            return { errorMessage: error.errors, statusCode: 403, isValid: false }
        }
    }
    return { isValid: true, statusCode: 202 }

}
export { checkBody }



