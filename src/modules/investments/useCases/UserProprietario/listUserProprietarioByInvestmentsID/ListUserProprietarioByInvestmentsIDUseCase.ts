import { IUserProprietarioRepository } from "../../../repositories/IUserProprietarioRepository"
import { ListUserProprietarioRequestProps } from "./ListUserProprietarioByInvestmentsIDController"
import { validationResponse } from "../../../../../types"
import { validatePageParams } from "../../../../../utils/userInvestmentUtils"
import { UserProprietarioEntity } from "../../../entities/UserProprietario"
import { Investment, UserProprietario, Users } from "@prisma/client"
//////

interface ListUserProprietarioFormatted {
    investmentID?: UserProprietarioEntity["investmentID"]
    page: number,
    pageRange: number
}

class ListUserProprietarioByInvestmentsIDUseCase {
    constructor(
        private userInvestmentRepository: IUserProprietarioRepository) { }

    async execute(listUserProprietarioData: ListUserProprietarioRequestProps): Promise<UserProprietario[]> {

        try {

            const { investmentID } = listUserProprietarioData

            const { page, pageRange } = await validatePageParams(listUserProprietarioData)


            const listUserProprietarioFormatted: ListUserProprietarioFormatted = {
                investmentID,
                page,
                pageRange
            }

            const response = await this.userInvestmentRepository.filterUserProprietarioByInvestmentID(listUserProprietarioFormatted)

            return response

        } catch (error) {
            throw error
        }
    }
}

export { ListUserProprietarioByInvestmentsIDUseCase, ListUserProprietarioFormatted }
