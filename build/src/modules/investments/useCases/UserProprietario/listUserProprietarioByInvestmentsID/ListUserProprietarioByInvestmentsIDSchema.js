"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listUserProprietarioByInvestmentsIDSchema = void 0;
const yup_1 = require("yup");
const listUserProprietarioByInvestmentsIDSchema = (0, yup_1.object)({
    investmentID: (0, yup_1.string)(),
    page: (0, yup_1.string)(),
    pageRange: (0, yup_1.string)()
});
exports.listUserProprietarioByInvestmentsIDSchema = listUserProprietarioByInvestmentsIDSchema;
