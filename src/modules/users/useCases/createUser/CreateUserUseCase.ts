// src/modules/users/useCases/createUser/CreateUserUseCase.ts

import { PrismaClient, User } from "@prisma/client";

const prisma = new PrismaClient();

// Define os dados que esperamos receber para criar um usuário
interface ICreateUserDTO {
    email: string;
    auth0UserId: string;
}

/**
 * @class CreateUserUseCase
 * @description Lógica de negócio para criar um novo usuário no banco de dados.
 */
class CreateUserUseCase {
    /**
     * Executa a criação do usuário.
     * @param {ICreateUserDTO} data - Os dados do usuário a serem criados.
     * @returns {Promise<User>} O usuário recém-criado.
     */
    async execute({ email, auth0UserId }: ICreateUserDTO): Promise<User> {
        // 1. Verifica se um usuário com o mesmo auth0UserId já existe
        const userAlreadyExists = await prisma.user.findUnique({
            where: { auth0UserId },
        });

        // Se o usuário já existir, simplesmente o retorna sem criar um novo.
        // Isso torna a operação segura contra chamadas duplicadas.
        if (userAlreadyExists) {
            console.log(`Usuário com auth0UserId ${auth0UserId} já existe. Nenhuma ação necessária.`);
            return userAlreadyExists;
        }

        // 2. Se não existir, cria o novo usuário no banco de dados
        const newUser = await prisma.user.create({
            data: {
                email,
                auth0UserId,
            },
        });

        console.log(`✅ Novo usuário criado com sucesso: ${email}`);
        return newUser;
    }
}

export { CreateUserUseCase };
