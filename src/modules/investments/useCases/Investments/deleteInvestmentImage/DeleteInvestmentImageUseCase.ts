import { Investment } from "@prisma/client"
import { IInvestmentRepository } from "../../../repositories/IInvestmentRepository"
import { InvestmentEntity } from "../../../entities/Investments"



class DeleteInvestmentImageUseCase {
    constructor(
        private InvestmentRepository: IInvestmentRepository) {}

    async execute(investmentID:InvestmentEntity["id"] , id: InvestmentEntity["photos"][0]["images"][0]["id"]): Promise<Investment> {
        
        const deletedUsers = await this.InvestmentRepository.deleteInvestmentImage(investmentID, id)
        
        return deletedUsers
    }
    
}

export {DeleteInvestmentImageUseCase}