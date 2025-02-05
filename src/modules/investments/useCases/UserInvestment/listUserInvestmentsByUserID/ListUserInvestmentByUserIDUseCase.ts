import { IUserInvestmentRepository } from "../../../repositories/IUserInvestmentRepository"
import { ListUserInvestmentRequestProps } from "./ListUserInvestmentByUserIDController"
import { validationResponse } from "../../../../../types"
import { validatePageParams } from "../../../../../utils/userInvestmentUtils"
import { UserInvestmentEntity } from "../../../entities/UserInvestment"
import { Investment, UserInvestment, Users } from "@prisma/client"
//////

interface ListUserInvestmentFormatted {
    userID?: UserInvestmentEntity["userID"]
    page: number,
    pageRange: number
}

class ListUserInvestmentByUserIDUseCase {
    constructor(
        private userInvestmentRepository: IUserInvestmentRepository) { }

    async execute(listUserInvestmentData: ListUserInvestmentRequestProps): Promise<UserInvestment[]> {

        try {

            const { userID } = listUserInvestmentData

            const { page, pageRange } = await validatePageParams(listUserInvestmentData)


            const listUserInvestmentFormatted: ListUserInvestmentFormatted = {
                userID,
                page,
                pageRange
            }

            const response = await this.userInvestmentRepository.filterUserInvestmentByUserID(listUserInvestmentFormatted)

            return response

        } catch (error) {
            throw error
        }
    }
}

export { ListUserInvestmentByUserIDUseCase, ListUserInvestmentFormatted }
