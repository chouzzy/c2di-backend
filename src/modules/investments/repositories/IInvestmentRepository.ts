import { Investment } from "@prisma/client"
import { validationResponse } from "../../../types"
import { CreateInvestmentRequestProps } from "../useCases/Investments/createInvestment/CreateInvestmentController"
import { ListInvestmentRequestProps } from "../useCases/Investments/listInvestment/ListInvestmentsController"
import { ListInvestmentProps } from "../useCases/Investments/listInvestment/ListInvestmentsUseCase"
import { UpdateInvestmentRequestProps } from "../useCases/Investments/updateInvestment/UpdateInvestmentController"
import { InvestmentEntity } from "../entities/Investments"
import { Worksheet } from "exceljs"


interface IInvestmentRepository {

    filterInvestment(listUserInvestmentData: ListInvestmentProps): Promise<Investment[]>

    filterInvestmentByID(id:InvestmentEntity["id"]): Promise<Investment|null>
    
    createInvestment(investmentData: CreateInvestmentRequestProps): Promise<Investment>

    updateInvestment(investmentData: UpdateInvestmentRequestProps, id:InvestmentEntity["id"]): Promise<Investment>
    
    deleteInvestment(id:InvestmentEntity["id"]): Promise<Investment>

    deleteInvestmentImage(investmentID:InvestmentEntity["id"] , id: InvestmentEntity["photos"][0]["images"][0]["id"]): Promise<Investment>

    deleteInvestmentDocument(investmentID:InvestmentEntity["id"] , id: InvestmentEntity["documents"][0]["id"]): Promise<Investment["documents"]>

    deleteInvestmentPartner(investmentID:InvestmentEntity["id"] , id: InvestmentEntity["partners"][0]["id"]): Promise<Investment["partners"]>
    
    importInvestmentProgress(worksheet:Worksheet, id:Investment["id"]): Promise<Investment>

    importUnidades(worksheet:Worksheet, id:Investment["id"]): Promise<Investment>

    importMetroQuadrado(worksheet:Worksheet, id:Investment["id"]): Promise<Investment>
}

export { IInvestmentRepository }