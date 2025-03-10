"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUsersSchema = void 0;
const yup = __importStar(require("yup"));
const yup_password_1 = __importDefault(require("yup-password"));
(0, yup_password_1.default)(yup); // Isso adiciona os métodos de validação de senha ao yup
const updateUsersSchema = yup.object({
    id: yup.string().required(),
    name: yup.string(),
    email: yup.string().email("Formato de email inválido"),
    phoneNumber: yup.string(),
    gender: yup.string(),
    profession: yup.string(),
    birth: yup.date(),
    username: yup.string(),
    address: yup.object().shape({
        street: yup.string(),
        number: yup.string(),
        complement: yup.string().optional(),
        district: yup.string(),
        city: yup.string(),
        state: yup.string(),
        zipCode: yup.string(),
    }).nullable(),
    investorProfileName: yup.string().optional().nullable(),
    investorProfileDescription: yup.string().optional().nullable(),
    userNotifications: yup.array().of(yup.object().shape({
        notificationID: yup.string().required("notificationID é obrigatório"),
        isRead: yup.boolean().required("isRead é obrigatório"),
    }))
});
exports.updateUsersSchema = updateUsersSchema;
