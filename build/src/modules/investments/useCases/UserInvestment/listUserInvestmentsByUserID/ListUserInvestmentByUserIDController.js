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
exports.ListUserInvestmentByUserIDController = void 0;
const UserInvestmentRepository_1 = require("../../../repositories/implementations/UserInvestmentRepository");
const ListUserInvestmentByUserIDCheck_1 = require("./ListUserInvestmentByUserIDCheck");
const ListUserInvestmentByUserIDUseCase_1 = require("./ListUserInvestmentByUserIDUseCase");
const client_1 = require("@prisma/client");
class ListUserInvestmentByUserIDController {
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const listUserInvestmentData = req.query;
                const bodyValidation = yield (0, ListUserInvestmentByUserIDCheck_1.checkQuery)(listUserInvestmentData);
                if (bodyValidation.isValid === false) {
                    return res.status(401).json({ errorMessage: bodyValidation.errorMessage });
                }
                // Instanciando o useCase no repositório com as funções
                const userInvestmentRepository = new UserInvestmentRepository_1.UserInvestmentRepository();
                const listUserInvestmentByUserIDUseCase = new ListUserInvestmentByUserIDUseCase_1.ListUserInvestmentByUserIDUseCase(userInvestmentRepository);
                const response = yield listUserInvestmentByUserIDUseCase.execute(listUserInvestmentData);
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
                    return res.status(401).json({ error: { name: 'ListUserInvestmentByUserIDController error: C2DI API', message: String(error) } });
                }
            }
        });
    }
}
exports.ListUserInvestmentByUserIDController = ListUserInvestmentByUserIDController;
