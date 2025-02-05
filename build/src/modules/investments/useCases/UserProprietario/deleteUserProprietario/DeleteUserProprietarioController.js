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
exports.DeleteUserProprietariosController = void 0;
const DeleteUserProprietarioUseCase_1 = require("./DeleteUserProprietarioUseCase");
const DeleteUserProprietarioCheck_1 = require("./DeleteUserProprietarioCheck");
const axios_1 = require("axios");
const client_1 = require("@prisma/client");
const UserProprietarioRepository_1 = require("../../../repositories/implementations/UserProprietarioRepository");
class DeleteUserProprietariosController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                if (typeof (id) != 'string') {
                    return res.status(401).json({ Error: "ID inválido" });
                }
                yield (0, DeleteUserProprietarioCheck_1.checkBody)(id);
                const userRepository = new UserProprietarioRepository_1.UserProprietarioRepository();
                const deleteUsersUseCase = new DeleteUserProprietarioUseCase_1.DeleteUsersUseCase(userRepository);
                const userProprietarioDeleted = yield deleteUsersUseCase.execute(id);
                return res.status(200).json({
                    userProprietarioDeleted: userProprietarioDeleted
                });
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
                    return res.status(401).json({
                        error: {
                            name: error.name,
                            message: error.message
                        }
                    });
                }
                else if (error instanceof axios_1.AxiosError) {
                    return res.status(401).json({ error });
                }
                else {
                    return res.status(401).json({ error: { name: 'DeleteUserProprietariosController error: C2DI API', message: String(error) } });
                }
            }
        });
    }
}
exports.DeleteUserProprietariosController = DeleteUserProprietariosController;
