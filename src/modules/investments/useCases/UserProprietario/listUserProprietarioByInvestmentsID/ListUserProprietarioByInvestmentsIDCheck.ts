import { ValidationError } from "yup";
import { ListUserProprietarioRequestProps } from "./ListUserProprietarioByInvestmentsIDController";
import { listUserProprietarioByInvestmentsIDSchema } from "./ListUserProprietarioByInvestmentsIDSchema";

async function checkQuery(listUserProprietarioData: ListUserProprietarioRequestProps) {

    try {
        await listUserProprietarioByInvestmentsIDSchema.validate(listUserProprietarioData, {
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