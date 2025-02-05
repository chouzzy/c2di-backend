import { validationResponse } from "../../../../../types"
import { IUserProprietarioRepository } from "../../../repositories/IUserProprietarioRepository"
import { CreateUserProprietarioRequestProps } from "./CreateUserProprietarioController"



class CreateUserProprietarioUseCase {
    constructor(
        private UserProprietarioRepository: IUserProprietarioRepository) {}

    async execute(userInvestmentData: CreateUserProprietarioRequestProps): Promise<validationResponse> {
        
        const createdUsers = await this.UserProprietarioRepository.createUserProprietario(userInvestmentData)
        
        return createdUsers
    }
    
}

export {CreateUserProprietarioUseCase}