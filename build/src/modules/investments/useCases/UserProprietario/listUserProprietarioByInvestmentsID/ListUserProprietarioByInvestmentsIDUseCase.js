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
exports.ListUserProprietarioByInvestmentsIDUseCase = void 0;
const userInvestmentUtils_1 = require("../../../../../utils/userInvestmentUtils");
class ListUserProprietarioByInvestmentsIDUseCase {
    constructor(userInvestmentRepository) {
        this.userInvestmentRepository = userInvestmentRepository;
    }
    execute(listUserProprietarioData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { investmentID } = listUserProprietarioData;
                const { page, pageRange } = yield (0, userInvestmentUtils_1.validatePageParams)(listUserProprietarioData);
                const listUserProprietarioFormatted = {
                    investmentID,
                    page,
                    pageRange
                };
                const response = yield this.userInvestmentRepository.filterUserProprietarioByInvestmentID(listUserProprietarioFormatted);
                return response;
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.ListUserProprietarioByInvestmentsIDUseCase = ListUserProprietarioByInvestmentsIDUseCase;
