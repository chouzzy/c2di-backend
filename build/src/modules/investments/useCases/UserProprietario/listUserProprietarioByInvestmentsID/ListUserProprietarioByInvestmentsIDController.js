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
exports.ListUserProprietarioByInvestmentsIDController = void 0;
const UserProprietarioRepository_1 = require("../../../repositories/implementations/UserProprietarioRepository");
const ListUserProprietarioByInvestmentsIDCheck_1 = require("./ListUserProprietarioByInvestmentsIDCheck");
const ListUserProprietarioByInvestmentsIDUseCase_1 = require("./ListUserProprietarioByInvestmentsIDUseCase");
const client_1 = require("@prisma/client");
class ListUserProprietarioByInvestmentsIDController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listUserProprietarioData = req.query;
                const bodyValidation = yield (0, ListUserProprietarioByInvestmentsIDCheck_1.checkQuery)(listUserProprietarioData);
                if (bodyValidation.isValid === false) {
                    return res.status(401).json({ errorMessage: bodyValidation.errorMessage });
                }
                // Instanciando o useCase no repositório com as funções
                const userInvestmentRepository = new UserProprietarioRepository_1.UserProprietarioRepository();
                const listUsersUseCase = new ListUserProprietarioByInvestmentsIDUseCase_1.ListUserProprietarioByInvestmentsIDUseCase(userInvestmentRepository);
                const response = yield listUsersUseCase.execute(listUserProprietarioData);
                return res.status(200).json({
                    successMessage: "Investimentos listados com sucesso!",
                    list: response
                });
            }
            catch (error) {
                if (error instanceof client_1.Prisma.PrismaClientValidationError) {
                    console.log(error);
                    return res.status(401).json({
                        error: {
                            name: error.name,
                            message: error.message,
                        }
                    });
                }
                else {
                    console.log(error);
                    return res.status(401).json({ error: { name: 'ListUserProprietarioByInvestmentsIDController error: C2DI API', message: String(error) } });
                }
            }
        });
    }
}
exports.ListUserProprietarioByInvestmentsIDController = ListUserProprietarioByInvestmentsIDController;
