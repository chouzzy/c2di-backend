import { UserProprietario } from "@prisma/client";
import { validationResponse } from "../../../../../types";
import { UserProprietarioEntity } from "../../../entities/UserProprietario";
import { IUserProprietarioRepository } from "../../../repositories/IUserProprietarioRepository";


class DeleteUsersUseCase {
    constructor(
        private userProprietarioRepository: IUserProprietarioRepository) {}

    async execute(id:UserProprietarioEntity["id"]): Promise<UserProprietario> {
        
        try {
            
            const deletedUsers = await this.userProprietarioRepository.deleteUserProprietario(id)
            
            return deletedUsers

        } catch (error) {
            throw error
        }
    }
    
}

export {DeleteUsersUseCase}