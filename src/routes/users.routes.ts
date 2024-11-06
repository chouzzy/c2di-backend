import { Router } from "express"
import { CreateUsersController } from "../modules/registrations/useCases/Users/createUsers/CreateUsersController"
import { ListUsersController } from "../modules/registrations/useCases/Users/listUsers/ListUsersController"
import { UpdateUsersController } from "../modules/registrations/useCases/Users/updateUsers/UpdateUsersController"
import { DeleteUsersController } from "../modules/registrations/useCases/Users/deleteUsers/DeleteUsersController"
import { ListResumedUsersController } from "../modules/registrations/useCases/Users/listResumedUsers/ListResumedUsersController"
import { checkJwtFromCookie, jwtCheck  } from "../modules/registrations/middleware/auth0Check"
import { FindUserByEmailController } from "../modules/registrations/useCases/Users/findUserByEmail/FindUserByEmailController"

const usersRoutes = Router()   


const listUsersController = new ListUsersController()
usersRoutes.get('/', checkJwtFromCookie , listUsersController.handle)

const findUserByEmailController = new FindUserByEmailController()
usersRoutes.get('/findUnique', checkJwtFromCookie , findUserByEmailController.handle)

const createUsersController = new CreateUsersController()
usersRoutes.post('/create', createUsersController.handle)

const updateUsersController = new UpdateUsersController()
usersRoutes.put('/update/:id', updateUsersController.handle)

const deleteUsersController = new DeleteUsersController()
usersRoutes.delete('/delete', deleteUsersController.handle)

const listResumedUsersController = new ListResumedUsersController()
usersRoutes.get('/resume', listResumedUsersController.handle)



// Não é mais necessário
// const authenticateUsersController = new AuthenticateUsersController()
// usersRoutes.post('/login', authenticateUsersController.handle)


export { usersRoutes }