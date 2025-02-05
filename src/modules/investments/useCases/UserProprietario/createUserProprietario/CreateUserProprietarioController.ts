import { Request, Response } from "express"
import { UserProprietarioRepository } from "../../../repositories/implementations/UserProprietarioRepository"
import { UserProprietarioEntity } from "../../../entities/UserProprietario"
import { checkBody } from "./CreateUserProprietarioCheck"
import { CreateUserProprietarioUseCase } from "./CreateUserProprietarioUseCase"
import { v4 as uuidv4 } from 'uuid';


interface CreateUserProprietarioRequestProps {
    userID: UserProprietarioEntity["userID"],
    investmentID: UserProprietarioEntity["investmentID"]
    investedValue: UserProprietarioEntity["investedValue"]
    valorCorrente: UserProprietarioEntity["valorCorrente"]
    documents?: UserProprietarioEntity["documents"]
    dataInvestimento?: UserProprietarioEntity["dataInvestimento"]
    apartamentID:UserProprietarioEntity["apartamentID"]
}

class CreateUserProprietarioController {
    async handle(req: Request, res: Response): Promise<Response> {


        const userInvestmentData: CreateUserProprietarioRequestProps = req.body
        const {documents} = userInvestmentData

        if (documents) {
            documents.map((doc) => {
                doc.id = uuidv4()
            })
        }

        const bodyValidation = await checkBody(userInvestmentData)

        if (bodyValidation.isValid === false) {
            return res.status(401).json({ errorMessage: bodyValidation.errorMessage })
        }

        /// instanciação da classe do caso de uso
        const userRepository = new UserProprietarioRepository()
        const createUsersUseCase = new CreateUserProprietarioUseCase(userRepository)
        const response = await createUsersUseCase.execute(userInvestmentData)

        return res.status(response.statusCode).json(response)

    }
}

export { CreateUserProprietarioController, CreateUserProprietarioRequestProps }