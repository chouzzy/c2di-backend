
import { ListUserProprietarioRequestProps } from "./ListUserProprietariosController"
import { validationResponse } from "../../../../../types"
import { validatePageParams } from "../../../../../utils/userInvestmentUtils"
import { UserProprietarioEntity } from "../../../entities/UserProprietario"
import { Investment, UserProprietario, Users } from "@prisma/client"
import { IUserProprietarioRepository } from "../../../repositories/IUserProprietarioRepository"
//////

interface ListUserProprietarioFormatted {
    userID?: UserProprietarioEntity["userID"],
    investmentID?: UserProprietarioEntity["investmentID"]
    page: number,
    pageRange: number
}

class ListUserProprietarioUseCase {
    constructor(
        private userInvestmentRepository: IUserProprietarioRepository) { }

    async execute(listUserProprietarioData: ListUserProprietarioRequestProps): Promise<Investment[] | Users[] | UserProprietario[] | undefined> {

        try {

            const { userID, investmentID } = listUserProprietarioData

            const { page, pageRange } = await validatePageParams(listUserProprietarioData)


            const listUserProprietarioFormatted: ListUserProprietarioFormatted = {
                userID,
                investmentID,
                page,
                pageRange
            }

            const response = await this.userInvestmentRepository.filterUserProprietario(listUserProprietarioFormatted)

            return response

        } catch (error) {
            throw error
        }
    }
}

export { ListUserProprietarioUseCase, ListUserProprietarioFormatted }
