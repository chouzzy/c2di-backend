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
exports.checkBody = void 0;
const UpdateUsersSchema_1 = require("./UpdateUsersSchema");
function checkBody(usersData, id) {
    return __awaiter(this, void 0, void 0, function* () {
        // check body properties
        try {
            const data = Object.assign(Object.assign({}, usersData), { id });
            const yupValidation = yield UpdateUsersSchema_1.updateUsersSchema.validate(data, {
                abortEarly: false,
            });
            if (!id) {
                throw Error("ID do usuário inválido.");
            }
            return yupValidation;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.checkBody = checkBody;
