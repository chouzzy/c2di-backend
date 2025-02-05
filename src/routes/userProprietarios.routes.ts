import { Router } from "express"
import { ensureAuthenticated } from "../modules/registrations/middleware/ensureAuthenticate"
import { checkJwtFromCookie } from "../modules/registrations/middleware/auth0Check"
import { ListUserProprietarioController } from "../modules/investments/useCases/UserProprietario/listUserProprietario/ListUserProprietariosController"
import { CreateUserProprietarioController } from "../modules/investments/useCases/UserProprietario/createUserProprietario/CreateUserProprietarioController"
import { ListUserProprietarioByInvestmentsIDController } from "../modules/investments/useCases/UserProprietario/listUserProprietarioByInvestmentsID/ListUserProprietarioByInvestmentsIDController"
import { DeleteUserProprietariosController } from "../modules/investments/useCases/UserProprietario/deleteUserProprietario/DeleteUserProprietarioController"

const userProprietariosRoutes = Router()

const listUserProprietarioController = new ListUserProprietarioController()
userProprietariosRoutes.get('/', listUserProprietarioController.handle)

const listUserProprietarioByInvestmentsIDController = new ListUserProprietarioByInvestmentsIDController()
userProprietariosRoutes.get('/byInvestment', listUserProprietarioByInvestmentsIDController.handle)

const deleteUserProprietarioController = new DeleteUserProprietariosController()
userProprietariosRoutes.delete('/delete/:id', deleteUserProprietarioController.handle)

const createUserProprietarioController = new CreateUserProprietarioController()
userProprietariosRoutes.post('/create', createUserProprietarioController.handle)



export { userProprietariosRoutes }