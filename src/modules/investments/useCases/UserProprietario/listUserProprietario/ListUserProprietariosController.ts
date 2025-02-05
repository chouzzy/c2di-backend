import { Request, Response } from "express";
import { UserProprietarioEntity } from "../../../entities/UserProprietario";
import { ListUserProprietarioUseCase } from "./ListUserProprietariosUseCase";
import { Prisma } from "@prisma/client";
import { checkQuery } from "./ListUserProprietariosCheck";
import { UserProprietarioRepository } from "../../../repositories/implementations/UserProprietarioRepository";

interface ListUserProprietarioRequestProps {

    userID?: UserProprietarioEntity["userID"],
    investmentID?: UserProprietarioEntity["investmentID"]
    page?: string,
    pageRange?: string
}

class ListUserProprietarioController {
    async handle(req: Request, res: Response): Promise<Response> {

        try {


            const listUserProprietarioData: ListUserProprietarioRequestProps = req.query

            const bodyValidation = await checkQuery(listUserProprietarioData)

            if (bodyValidation.isValid === false) {
                return res.status(401).json({ errorMessage: bodyValidation.errorMessage })
            }

            // Instanciando o useCase no repositório com as funções
            const userInvestmentRepository = new UserProprietarioRepository()

            const listUsersUseCase = new ListUserProprietarioUseCase(userInvestmentRepository);

            const response = await listUsersUseCase.execute(listUserProprietarioData)

            return res.status(200).json({
                successMessage: "Proprietários listados com sucesso!",
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
                return res.status(401).json({ error: { name: 'ListUserProprietarioController error: C2DI API', message: String(error) } })
            }
        }

    }
}

export { ListUserProprietarioController, ListUserProprietarioRequestProps }