import { ValidationError } from "yup";
import { validationResponse } from "../../../../../types";
import { Investment } from "@prisma/client";
import { InvestmentEntity } from "../../../entities/Investments";
import { deleteInvestmentImageSchema } from "./DeleteInvestmentImageSchema";




async function checkParam(id: InvestmentEntity["photos"][0]["images"][0]["id"]): Promise<validationResponse> {
    // check body properties
    try {
        await deleteInvestmentImageSchema.validate({id}, {
            abortEarly: false,
        })
        return { isValid: true, statusCode: 202 }
    }
    catch (error) {
        throw error
    }
}
export { checkParam }



