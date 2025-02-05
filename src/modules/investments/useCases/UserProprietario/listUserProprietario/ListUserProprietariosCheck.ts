import { ValidationError } from "yup";
import { listUserProprietarioSchema } from "./ListUserProprietariosSchema";
import { ListUserProprietarioRequestProps } from "./ListUserProprietariosController";

async function checkQuery(listUserProprietarioData: ListUserProprietarioRequestProps) {

    try {
        await listUserProprietarioSchema.validate(listUserProprietarioData, {
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