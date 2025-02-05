import { ValidationError } from "yup";
import { ListUserInvestmentRequestProps } from "./ListUserInvestmentByUserIDController";
import { listUserInvestmentByUserIDSchema } from "./ListUserInvestmentByUserIDSchema";

async function checkQuery(listUserInvestmentData: ListUserInvestmentRequestProps) {

    try {
        await listUserInvestmentByUserIDSchema.validate(listUserInvestmentData, {
            abortEarly: false
        })
    } catch (error) {
        if (error instanceof ValidationError) {
            return { errorMessage: error.errors, statusCode: 403, isValid: false }
        }
    }

    return { isValid: true, statusCode: 302 }

}
export { checkQuery}