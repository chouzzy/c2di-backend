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
exports.UserProprietarioRepository = void 0;
const userProprietarioUtils_1 = require("../../../../utils/userProprietarioUtils");
const userProprietarioUtils_2 = require("../../../../utils/userProprietarioUtils");
class UserProprietarioRepository {
    constructor() {
        this.userProprietario = [];
    }
    filterUserProprietario(listUserProprietarioData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userID, investmentID } = listUserProprietarioData;
                if (userID && !investmentID) {
                    const filteredInvestmentsByUserID = yield (0, userProprietarioUtils_1.filterPrismaInvestmentsByUserID)(listUserProprietarioData);
                    return filteredInvestmentsByUserID;
                }
                if (!userID && investmentID) {
                    const filteredUsersByInvestmentIDs = yield (0, userProprietarioUtils_1.filterPrismaInvestmentsByInvestmentID)(listUserProprietarioData);
                    return filteredUsersByInvestmentIDs;
                }
                if (!userID && !investmentID) {
                    const allUserProprietarios = yield (0, userProprietarioUtils_2.filterPrismaUserProprietario)(listUserProprietarioData);
                    return allUserProprietarios;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    filterUserProprietarioByInvestmentID(listUserProprietarioData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userID, investmentID } = listUserProprietarioData;
                if (!investmentID) {
                    throw Error("ID do investimento inválido");
                }
                const filteredUsersByInvestmentIDs = yield (0, userProprietarioUtils_2.filterPrismaUserProprietariosByInvestmentID)(listUserProprietarioData);
                return filteredUsersByInvestmentIDs;
            }
            catch (error) {
                throw error;
            }
        });
    }
    createUserProprietario(userProprietarioData) {
        return __awaiter(this, void 0, void 0, function* () {
            const userProprietario = yield (0, userProprietarioUtils_2.createPrismaUserProprietario)(userProprietarioData);
            return {
                isValid: true,
                statusCode: 202,
                successMessage: 'Created investment.',
                userProprietario: userProprietario
            };
        });
    }
    deleteUserProprietario(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userProprietarioDeleted = yield (0, userProprietarioUtils_2.deletePrismaUserProprietarios)(id);
            return userProprietarioDeleted;
        });
    }
}
exports.UserProprietarioRepository = UserProprietarioRepository;
