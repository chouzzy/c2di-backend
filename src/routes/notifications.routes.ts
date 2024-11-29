import { Router } from "express"
import { CreateNotificationsController } from "../modules/notifications/useCases/Notifications/createNotifications/CreateNotificationsController"
import { checkJwtFromCookie } from "../modules/registrations/middleware/auth0Check"
import { ListNotificationsController } from "../modules/notifications/useCases/Notifications/listNotifications/ListNotificationsController"
import { ReadNotificationsController } from "../modules/notifications/useCases/Notifications/readNotifications/ReadNotificationsController"

const notificationsRoutes = Router()

const createNotificationsController = new CreateNotificationsController()
notificationsRoutes.post('/create', checkJwtFromCookie, createNotificationsController.handle)

const listNotificationsController = new ListNotificationsController()
notificationsRoutes.get('/list/:id', checkJwtFromCookie, listNotificationsController.handle)

const readNotificationsController = new ReadNotificationsController()
notificationsRoutes.put('/update/:id', checkJwtFromCookie, readNotificationsController.handle)


export { notificationsRoutes }