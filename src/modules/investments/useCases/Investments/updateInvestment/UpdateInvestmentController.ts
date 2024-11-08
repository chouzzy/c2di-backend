import { InvestmentEntity } from "../../../entities/Investments"
import { Request, Response } from "express"
import { InvestmentRepository } from "../../../repositories/implementations/InvestmentRepository"
import { UpdateInvestmentUseCase } from "./UpdateInvestmentUseCase"
import { checkBody } from "./UpdateInvestmentCheck"
import { Prisma } from "@prisma/client"


interface UpdateInvestmentRequestProps {

    title?: InvestmentEntity["title"];
    description?: InvestmentEntity["description"];
    projectType?: InvestmentEntity["projectType"];
    totalUnits?: InvestmentEntity["totalUnits"];
    numberOfFloors?: InvestmentEntity["numberOfFloors"];
    unitsPerFloor?: InvestmentEntity["unitsPerFloor"];
    floorPlanTypes?: InvestmentEntity["floorPlanTypes"];
    launchDate?: InvestmentEntity["launchDate"];
    constructionStartDate?: InvestmentEntity["constructionStartDate"];
    expectedDeliveryDate?: InvestmentEntity["expectedDeliveryDate"];
    address?: InvestmentEntity["address"];
    documents?: InvestmentEntity["documents"];
    images?: InvestmentEntity["images"];
    investmentValue?: InvestmentEntity["investmentValue"];
    companyName?: InvestmentEntity["companyName"];
    partners?: InvestmentEntity["partners"];
    finishDate?: InvestmentEntity["finishDate"];
    buildingStatus?: InvestmentEntity["buildingStatus"];
    investmentDate?: InvestmentEntity["investmentDate"];
    predictedCost?: InvestmentEntity["predictedCost"];
    realizedCost?: InvestmentEntity["realizedCost"];

}

class UpdateInvestmentsController {
    async handle(req: Request, res: Response): Promise<Response> {

        try {   

            const {id} = req.params

            // if (typeof(id) != 'string') {
            //     throw Error("O id deve ser uma string")
            // }
            
            const investmentData: UpdateInvestmentRequestProps = req.body

            await checkBody(investmentData)

            /// instanciação da classe do caso de uso
            const investmentRepository = new InvestmentRepository()
            const updateInvestmentUseCase = new UpdateInvestmentUseCase(investmentRepository)
            const investment = await updateInvestmentUseCase.execute(investmentData, id)

            return res.status(200).json({
                successMessage: "Investimentos atualizados com sucesso!",
                investment: investment
            })

        } catch (error) {

            if (error instanceof Prisma.PrismaClientValidationError) {
                console.log(error)
                return res.status(401).json({
                    error: {
                        name: error.name,
                        message: error.message,
                    }
                })

            } else {
                console.log(error)
                return res.status(401).json({ error: { name: 'UpdateInvestmentsController error: C2DI API', message: String(error) } })
            }
        }

    }
}

export { UpdateInvestmentsController, UpdateInvestmentRequestProps }