"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUserInvestmentByUserIDSchema = void 0;
const yup_1 = require("yup");
const listUserInvestmentByUserIDSchema = (0, yup_1.object)({
    userID: (0, yup_1.string)(),
    page: (0, yup_1.string)(),
    pageRange: (0, yup_1.string)()
});
exports.listUserInvestmentByUserIDSchema = listUserInvestmentByUserIDSchema;
