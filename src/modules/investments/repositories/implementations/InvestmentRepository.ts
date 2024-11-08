import { Investment, Prisma } from "@prisma/client"
import { validationResponse } from "../../../../types"
import { createPrismaInvestment, deletePrismaInvestment, filterPrismaInvestment, filterPrismaInvestmentByID, updatePrismaInvestment } from "../../../../utils/investmentUtils"
import { CreateInvestmentRequestProps } from "../../useCases/Investments/createInvestment/CreateInvestmentController"
import { ListInvestmentRequestProps } from "../../useCases/Investments/listInvestment/ListInvestmentsController"
import { ListInvestmentProps } from "../../useCases/Investments/listInvestment/ListInvestmentsUseCase"
import { IInvestmentRepository } from "../IInvestmentRepository"
import { InvestmentEntity } from "../../entities/Investments"
import { UpdateInvestmentRequestProps } from "../../useCases/Investments/updateInvestment/UpdateInvestmentController"


class InvestmentRepository implements IInvestmentRepository {

    async filterInvestmentByID(id:InvestmentEntity["id"]): Promise<Investment|null> {

        try {

            const filteredInvestment = await filterPrismaInvestmentByID(id)

            return filteredInvestment

        } catch (error: unknown) {

            throw error
        }

    }
    async filterInvestment(listInvestmentFormatted: ListInvestmentProps): Promise<Investment[]> {

        try {

            const filteredInvestment = await filterPrismaInvestment(listInvestmentFormatted)

            return filteredInvestment

        } catch (error: unknown) {

            throw error
        }

    }

    async createInvestment(investmentData: CreateInvestmentRequestProps): Promise<Investment> {

        try {

            const createdInvestment = await createPrismaInvestment(investmentData)

            return createdInvestment

        } catch (error: unknown) {
            throw error
        }
    }

    async updateInvestment(investmentData: UpdateInvestmentRequestProps, id: InvestmentEntity["id"]): Promise<Investment> {
        try {

            const updatedInvestment = await updatePrismaInvestment(investmentData, id)

            return updatedInvestment

        } catch (error: unknown) {
            throw error
        }
    }

    async deleteInvestment(id: InvestmentEntity["id"]): Promise<Investment> {

        try {

            const deletedInvestment = await deletePrismaInvestment(id)

            return deletedInvestment

        } catch (error) {
            throw error
        }
    }

}

export { InvestmentRepository }