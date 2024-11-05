import { $Enums, Prisma, Users } from "@prisma/client";
import { userCreated, usersResumed, validationResponse } from "../../../../types";
import { UsersEntity } from "../../entities/Users";
import { CreateUsersRequestProps } from "../../useCases/Users/createUsers/CreateUsersController";

import { IUsersRepository } from "../IUsersRepository";
import { createPrismaUser, deletePrismaUser, filterPrismaUser, filterResumedPrismaUser, updatePrismaUser } from "../../../../utils/userUtils";
import { FilterUsersProps } from "../../useCases/Users/listUsers/ListUsersUseCase";
import { UpdateUsersRequestProps } from "../../useCases/Users/updateUsers/UpdateUsersController";
import { ListResumedUsersProps } from "../../useCases/Users/listResumedUsers/ListResumedUsersUseCase";


class UsersRepository implements IUsersRepository {

    private users: UsersEntity[]
    constructor() {
        this.users = [];
    }

    async filterUsers(listUserFormatted: FilterUsersProps):
        Promise<Users[]> {

        try {

            const filteredUsers = await filterPrismaUser(listUserFormatted)

            return filteredUsers

        } catch (error) {
            throw error
        }
    }

    async listResumedUsers(listUserFormatted: ListResumedUsersProps):
        Promise<usersResumed[]> {

        try {

            const filteredResumedUsers = await filterResumedPrismaUser(listUserFormatted)

            return filteredResumedUsers

        } catch (error) {
            throw error
        }
    }

    async createUsers(usersData: CreateUsersRequestProps): Promise<userCreated> {

        try {

            const createUsers = await createPrismaUser(usersData)

            return {
                id: createUsers.id,
                name: createUsers.name,
                email: createUsers.email,
                username: createUsers.username
            }



        } catch (error) {
            throw error
        }
    }

    async updateUsers(usersData: UpdateUsersRequestProps, id: UsersEntity["id"]): Promise<Users> {

        try {

            const updatedUser = await updatePrismaUser(usersData, id)

            return updatedUser

        } catch (error) {
            throw error
        }

    }
    async deleteUsers(id: UsersEntity["id"]): Promise<string> {

        try {

            const deletedUser = await deletePrismaUser(id)

            return "Usuário deletado com sucesso."

        } catch (error) {
            throw error
        }

    }


}

export { UsersRepository }


































// Autenticação é feita pelo auth0
// async authenticateUsers({ username, password }: AuthenticateUsersRequestProps): Promise<validationResponse> {

//     try {

//         //Buscando o users
//         const usersFound = await prisma.users.findFirst({
//             where: {
//                 username: username
//             }
//         })

//         //Checando se o username está correto
//         if (!usersFound) {
//             return {
//                 isValid: false,
//                 statusCode: 403,
//                 errorMessage: "Usuário ou senha incorretos."
//             }
//         }

//         //Checando se o password está correto
//         const passwordMatch = await compare(password, usersFound.password)
//         if (!passwordMatch) {
//             return {
//                 isValid: false,
//                 statusCode: 403,
//                 errorMessage: "Usuário ou senha incorretos."
//             }
//         }
//         // Gerando o Token
//         const generateTokenProvider = new GenerateTokenProvider()
//         const token = await generateTokenProvider.execute(usersFound.id)



//         //Gerando refresh token
//         const generateRefreshToken = new GenerateRefreshToken()
//         const newRefreshToken = await generateRefreshToken.execute(usersFound.id)

//         return {
//             isValid: true,
//             token: token,
//             refreshToken: newRefreshToken.id,
//             users: usersFound,
//             statusCode: 202
//         }


//     } catch (error) {
//         // if (error instanceof Prisma.PrismaClientValidationError) {

//         //     const argumentPosition = error.message.search('Argument')
//         //     const mongoDBError = error.message.slice(argumentPosition)
//         //     return { isValid: false, errorMessage: mongoDBError, statusCode: 403 }

//         // } else {
//         return { isValid: false, errorMessage: String(error), statusCode: 403 }
//         // }
//     }


// }