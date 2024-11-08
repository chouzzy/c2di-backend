import { InvestmentEntity } from "../../../entities/Investments"
import { Request, Response } from "express"
import { InvestmentRepository } from "../../../repositories/implementations/InvestmentRepository"
import { CreateInvestmentUseCase } from "./CreateInvestmentUseCase"
import { checkBody } from "./CreateInvestmentCheck"
import { Prisma } from "@prisma/client"


interface CreateInvestmentRequestProps {

    title: InvestmentEntity["title"];
    description: InvestmentEntity["description"];
    projectType: InvestmentEntity["projectType"];
    totalUnits: InvestmentEntity["totalUnits"];
    numberOfFloors: InvestmentEntity["numberOfFloors"];
    unitsPerFloor: InvestmentEntity["unitsPerFloor"];
    floorPlanTypes: InvestmentEntity["floorPlanTypes"];
    launchDate: InvestmentEntity["launchDate"];
    constructionStartDate: InvestmentEntity["constructionStartDate"];
    expectedDeliveryDate: InvestmentEntity["expectedDeliveryDate"];
    address: InvestmentEntity["address"];
    documents: InvestmentEntity["documents"];
    images: InvestmentEntity["images"];
    investmentValue: InvestmentEntity["investmentValue"];
    companyName: InvestmentEntity["companyName"];
    partners: InvestmentEntity["partners"];
    finishDate: InvestmentEntity["finishDate"];
    buildingStatus: InvestmentEntity["buildingStatus"];
    investmentDate: InvestmentEntity["investmentDate"];
    predictedCost: InvestmentEntity["predictedCost"];
    realizedCost: InvestmentEntity["realizedCost"];

}

class CreateInvestmentsController {
    async handle(req: Request, res: Response): Promise<Response> {

        try {

            const investmentData: CreateInvestmentRequestProps = req.body

            await checkBody(investmentData)

            /// instanciação da classe do caso de uso
            const investmentRepository = new InvestmentRepository()
            const createInvestmentUseCase = new CreateInvestmentUseCase(investmentRepository)
            const investment = await createInvestmentUseCase.execute(investmentData)

            return res.status(200).json({
                successMessage: "Investimentos listados com sucesso!",
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
                return res.status(401).json({ error: { name: 'CreateInvestmentsController error: C2DI API', message: String(error) } })
            }
        }

    }
}

export { CreateInvestmentsController, CreateInvestmentRequestProps }