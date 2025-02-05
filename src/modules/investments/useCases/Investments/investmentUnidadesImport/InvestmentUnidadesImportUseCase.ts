import { Investment } from "@prisma/client"
import { validationResponse } from "../../../../../types"
import { IInvestmentRepository } from "../../../repositories/IInvestmentRepository"
import { Worksheet } from "exceljs"



class InvestmentUnidadesUseCase {
    constructor(
        private InvestmentRepository: IInvestmentRepository) {}

    async execute(worksheet:Worksheet, id:Investment["id"]): Promise<Investment> {
        
        const createdUsers = await this.InvestmentRepository.importUnidades(worksheet, id)
        
        return createdUsers
    }
    
}

export {InvestmentUnidadesUseCase}