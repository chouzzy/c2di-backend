import { validationResponse } from "../../../../../types";
import { UsersEntity } from "../../../entities/Users";
import { IUsersRepository } from "../../../repositories/IUsersRepository";

class DeleteUsersUseCase {
    constructor(
        private usersRepository: IUsersRepository) {}

    async execute(id:UsersEntity["id"]): Promise<string> {
        
        try {
            
            const deletedUsers = await this.usersRepository.deleteUsers(id)
            
            return deletedUsers

        } catch (error) {
            throw error
        }
    }
    
}

export {DeleteUsersUseCase}