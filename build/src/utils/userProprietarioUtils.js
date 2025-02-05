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
exports.validatePageParams = exports.deletePrismaUserProprietarios = exports.filterPrismaUserProprietariosByInvestmentID = exports.filterPrismaInvestmentsByInvestmentID = exports.filterPrismaInvestmentsByUserID = exports.filterPrismaUserProprietario = exports.createPrismaUserProprietario = void 0;
const prisma_1 = require("../prisma");
function createPrismaUserProprietario(userProprietarioData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userID, investmentID, investedValue, valorCorrente, dataInvestimento, documents, apartamentID } = userProprietarioData;
            const userProprietario = yield prisma_1.prisma.userProprietario.create({
                data: {
                    user: {
                        connect: {
                            id: userID
                        }
                    },
                    investment: {
                        connect: {
                            id: investmentID
                        }
                    },
                    investedValue: investedValue,
                    valorCorrente: valorCorrente,
                    documents: documents,
                    dataInvestimento: dataInvestimento,
                    apartamentID: apartamentID
                }
            });
            return userProprietario;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createPrismaUserProprietario = createPrismaUserProprietario;
function filterPrismaUserProprietario(listUserProprietarioData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userID, investmentID, page, pageRange } = listUserProprietarioData;
            if (!userID && !investmentID) {
                const userProprietario = yield prisma_1.prisma.userProprietario.findMany({
                    skip: (page - 1) * pageRange,
                    take: pageRange,
                });
                return userProprietario;
            }
            const userProprietario = yield prisma_1.prisma.userProprietario.findMany({
                where: {
                    AND: [
                        { userID },
                        { investmentID }
                    ]
                },
                skip: (page - 1) * pageRange,
                take: pageRange,
            });
            return userProprietario;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.filterPrismaUserProprietario = filterPrismaUserProprietario;
function filterPrismaInvestmentsByUserID(listUserProprietarioData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userID, page, pageRange } = listUserProprietarioData;
            // PEGA A LISTA DE INVESTIMENTOS DESSE USUARIO
            const userProprietarioList = yield prisma_1.prisma.userProprietario.findMany({
                where: { userID: userID },
                skip: (page - 1) * pageRange,
                take: pageRange,
            });
            // LISTA OS IDS DO INVESTIMENTO
            const investmentIDs = userProprietarioList.map((userProprietario) => { return userProprietario.investmentID; });
            // FILTRA TODOS OS INVESTIMENTOS QUE POSSUEM OS IDS ENCONTRADOS
            const investments = yield prisma_1.prisma.investment.findMany({
                where: {
                    id: {
                        in: investmentIDs, // Filtra os investimentos com base na lista de IDs
                    },
                },
            });
            return investments;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.filterPrismaInvestmentsByUserID = filterPrismaInvestmentsByUserID;
function filterPrismaInvestmentsByInvestmentID(listUserProprietarioData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { investmentID, page, pageRange } = listUserProprietarioData;
            // PEGA A LISTA DE INVESTIMENTOS DESSE USUARIO
            const userProprietarioList = yield prisma_1.prisma.userProprietario.findMany({
                where: { investmentID: investmentID },
                skip: (page - 1) * pageRange,
                take: pageRange,
            });
            // LISTA OS IDS DO INVESTIMENTO
            const userIDs = userProprietarioList.map((userProprietario) => { return userProprietario.userID; });
            // FILTRA TODOS OS INVESTIMENTOS QUE POSSUEM OS IDS ENCONTRADOS
            const users = yield prisma_1.prisma.users.findMany({
                where: {
                    id: {
                        in: userIDs, // Filtra os investimentos com base na lista de IDs
                    },
                },
            });
            return users;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.filterPrismaInvestmentsByInvestmentID = filterPrismaInvestmentsByInvestmentID;
function filterPrismaUserProprietariosByInvestmentID(listUserProprietarioData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { investmentID, page, pageRange } = listUserProprietarioData;
            // PEGA A LISTA DE INVESTIMENTOS NESSE PROJETO
            const userProprietarioList = yield prisma_1.prisma.userProprietario.findMany({
                where: { investmentID: investmentID },
                skip: (page - 1) * pageRange,
                take: pageRange,
            });
            return userProprietarioList;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.filterPrismaUserProprietariosByInvestmentID = filterPrismaUserProprietariosByInvestmentID;
function deletePrismaUserProprietarios(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userProprietarioDeleted = yield prisma_1.prisma.userProprietario.delete({ where: { id: id } });
            return userProprietarioDeleted;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.deletePrismaUserProprietarios = deletePrismaUserProprietarios;
function validatePageParams(listUserProprietarioData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { page, pageRange } = listUserProprietarioData;
            const pageInt = Number(page) || 1;
            const pageRangeInt = Number(pageRange) || 10;
            if (!Number.isInteger(pageInt) || pageInt <= 0) {
                throw new Error('Invalid page number');
            }
            if (!Number.isInteger(pageRangeInt) || pageRangeInt <= 0) {
                throw new Error('Invalid page range');
            }
            return {
                page: pageInt,
                pageRange: pageRangeInt,
            };
        }
        catch (error) {
            throw error;
        }
    });
}
exports.validatePageParams = validatePageParams;
