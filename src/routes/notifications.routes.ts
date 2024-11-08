import { Router } from "express"
import { CreateNotificationsController } from "../modules/notifications/useCases/Notifications/createNotifications/createNotificationsController"

const notificationsRoutes = Router()

const createNotificationsController = new CreateNotificationsController()
notificationsRoutes.post('/create', createNotificationsController.handle)


export { notificationsRoutes }