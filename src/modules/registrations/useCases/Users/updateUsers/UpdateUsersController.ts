import { Request, Response } from "express"
import { UsersEntity } from "../../../entities/Users"
import { UpdateUsersUseCase } from "./UpdateUsersUseCase"
import { UsersRepository } from "../../../repositories/implementations/UsersRepository"
import { checkBody } from "./UpdateUsersCheck"
import { Prisma } from "@prisma/client"

interface UpdateUsersRequestProps {

    name: UsersEntity["name"]
    email: UsersEntity["email"]
    phoneNumber: UsersEntity["phoneNumber"]
    gender: UsersEntity["gender"]
    profession: UsersEntity["profession"]
    birth: string | UsersEntity["birth"]
    username: UsersEntity["username"]
    address: UsersEntity["address"]
    investorProfileName: UsersEntity["investorProfileName"]
    investorProfileDescription: UsersEntity["investorProfileDescription"]
    userNotifications: UsersEntity["userNotifications"]
}

class UpdateUsersController {

    async handle(req: Request, res: Response): Promise<Response> {

        try {

            const usersData: UpdateUsersRequestProps = req.body

            if (typeof (usersData.birth) != 'string') {
                return res.status(401).json({ Error: "Data inválida" })
            }
            usersData.birth = new Date(usersData.birth)

            const { id } = await checkBody(usersData, req.params.id)

            const userRepository = new UsersRepository()
            const updateUsersUseCase = new UpdateUsersUseCase(userRepository)
            const user = await updateUsersUseCase.execute(usersData, id)


            return res.status(200).json({
                successMessage: "Usuário atualizado com sucesso!",
                user: user
            })

        } catch (error) {
            console.log(error)
            if (error instanceof Prisma.PrismaClientValidationError) {
                return res.status(401).json({
                    error: {
                        name: error.name,
                        message: error.message,
                    }
                })

            } else {
                return res.status(401).json({ error: { name: 'UpdateUsersController error: C2DI API', message: String(error) } })
            }

        }

    }
}

export { UpdateUsersController, UpdateUsersRequestProps }