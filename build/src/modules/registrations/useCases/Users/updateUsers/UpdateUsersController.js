"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUsersController = void 0;
const UpdateUsersUseCase_1 = require("./UpdateUsersUseCase");
const UsersRepository_1 = require("../../../repositories/implementations/UsersRepository");
const UpdateUsersCheck_1 = require("./UpdateUsersCheck");
const client_1 = require("@prisma/client");
class UpdateUsersController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const usersData = req.body;
                if (typeof (usersData.birth) != 'string') {
                    return res.status(401).json({ Error: "Data inválida" });
                }
                usersData.birth = new Date(usersData.birth);
                const { id } = yield (0, UpdateUsersCheck_1.checkBody)(usersData, req.params.id);
                const userRepository = new UsersRepository_1.UsersRepository();
                const updateUsersUseCase = new UpdateUsersUseCase_1.UpdateUsersUseCase(userRepository);
                const user = yield updateUsersUseCase.execute(usersData, id);
                return res.status(200).json({
                    successMessage: "Usuário atualizado com sucesso!",
                    user: user
                });
            }
            catch (error) {
                console.log(error);
                if (error instanceof client_1.Prisma.PrismaClientValidationError) {
                    return res.status(401).json({
                        error: {
                            name: error.name,
                            message: error.message,
                        }
                    });
                }
                else {
                    return res.status(401).json({ error: { name: 'UpdateUsersController error: C2DI API', message: String(error) } });
                }
            }
        });
    }
}
exports.UpdateUsersController = UpdateUsersController;
