import { Request, Response } from "express";
import { UserInvestmentEntity } from "../../../entities/UserInvestment";
import { UserInvestmentRepository } from "../../../repositories/implementations/UserInvestmentRepository";
import { checkQuery } from "./ListUserInvestmentByUserIDCheck";
import { ListUserInvestmentByUserIDUseCase } from "./ListUserInvestmentByUserIDUseCase";
import { Prisma } from "@prisma/client";

interface ListUserInvestmentRequestProps {

    userID?: UserInvestmentEntity["userID"]
    page?: string,
    pageRange?: string
}

class ListUserInvestmentByUserIDController {
    async handle(req: Request, res: Response): Promise<Response> {

        try {


            const listUserInvestmentData: ListUserInvestmentRequestProps = req.query

            const bodyValidation = await checkQuery(listUserInvestmentData)

            if (bodyValidation.isValid === false) {
                return res.status(401).json({ errorMessage: bodyValidation.errorMessage })
            }

            // Instanciando o useCase no repositório com as funções
            const userInvestmentRepository = new UserInvestmentRepository()

            const listUserInvestmentByUserIDUseCase = new ListUserInvestmentByUserIDUseCase(userInvestmentRepository);

            const response = await listUserInvestmentByUserIDUseCase.execute(listUserInvestmentData)

            return res.status(200).json({
                successMessage: "Investimentos listados com sucesso!",
                list: response
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
                return res.status(401).json({ error: { name: 'ListUserInvestmentByUserIDController error: C2DI API', message: String(error) } })
            }
        }

    }
}

export { ListUserInvestmentByUserIDController, ListUserInvestmentRequestProps }