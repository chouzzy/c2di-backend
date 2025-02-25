import { Notification } from "@prisma/client"
import { validationResponse } from "../../../../../types"
import { INotificationsRepository } from "../../../repositories/INotificationsRepository"
import { CreateNotificationsRequestProps } from "./CreateNotificationsController"



class CreateNotificationsUseCase {
    constructor(
        private NotificationsRepository: INotificationsRepository) {}

    async execute(notificationsData: CreateNotificationsRequestProps): Promise<Notification> {
        
        const createdNotifications = await this.NotificationsRepository.createNotifications(notificationsData)
        
        return createdNotifications
    }
    
}

export {CreateNotificationsUseCase}