import { Request, Response } from "express"
import { DeleteUsersUseCase } from "./DeleteUserProprietarioUseCase"
import { checkBody } from "./DeleteUserProprietarioCheck"
import { AxiosError } from "axios"
import { Prisma } from "@prisma/client"
import CryptoJS from 'crypto-js';
import { UserProprietarioRepository } from "../../../repositories/implementations/UserProprietarioRepository"

class DeleteUserProprietariosController {

    async handle(req: Request, res: Response): Promise<Response> {

        try {
            const {id} = req.params

            if (typeof (id) != 'string') {
                return res.status(401).json({ Error: "ID inválido" })
            }

            await checkBody(id)

            const userRepository = new UserProprietarioRepository()
            const deleteUsersUseCase = new DeleteUsersUseCase(userRepository)
            const userProprietarioDeleted = await deleteUsersUseCase.execute(id)


            return res.status(200).json({
                userProprietarioDeleted: userProprietarioDeleted
            })

        } catch (error) {

            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return res.status(401).json({
                    error: {
                        name: error.name,
                        message: error.message
                    }
                })

            } else if (error instanceof AxiosError) {
                return res.status(401).json({ error })
            }
            else {
                return res.status(401).json({ error: { name: 'DeleteUserProprietariosController error: C2DI API', message: String(error) } })
            }

        }

    }
}

export { DeleteUserProprietariosController }