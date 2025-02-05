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
exports.importInvestmentUnidades = exports.importPrismaInvestmentProgress = exports.deletePrismaInvestmentPartner = exports.deletePrismaInvestmentDocument = exports.validatePageParams = exports.deletePrismaInvestmentImage = exports.filterPrismaInvestmentByID = exports.deletePrismaInvestment = exports.updatePrismaInvestment = exports.filterPrismaInvestment = exports.createPrismaInvestment = void 0;
const prisma_1 = require("../prisma");
const uuid_1 = require("uuid");
function createPrismaInvestment(investmentData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            investmentData.launchDate = new Date(investmentData.launchDate);
            investmentData.constructionStartDate = new Date(investmentData.constructionStartDate);
            investmentData.expectedDeliveryDate = new Date(investmentData.expectedDeliveryDate);
            if (investmentData.finishDate) {
                investmentData.finishDate = new Date(investmentData.finishDate);
            }
            else {
                investmentData.finishDate = new Date('2030-12-12');
            }
            const { investmentDate } = investmentData;
            if (investmentDate) {
                investmentData.investmentDate = new Date(investmentDate);
            }
            const titleExists = yield prisma_1.prisma.investment.findFirst({
                where: { title: investmentData.title }
            });
            if (titleExists) {
                throw Error("Título já existente.");
            }
            console.log('investmentData');
            console.log(investmentData);
            const { buildingTotalProgress, financialTotalProgress, buildingProgress } = investmentData;
            if (!buildingTotalProgress) {
                investmentData.buildingTotalProgress = [{ data: new Date(), previsto: 0, realizado: 0 }];
            }
            if (!financialTotalProgress) {
                investmentData.financialTotalProgress = [{ data: new Date(), previsto: 0, realizado: 0 }];
            }
            if (!buildingProgress) {
                investmentData.buildingProgress = {
                    acabamento: 0,
                    alvenaria: 0,
                    estrutura: 0,
                    fundacao: 0,
                    instalacoes: 0,
                    pintura: 0
                };
            }
            const createdInvestment = yield prisma_1.prisma.investment.create({
                data: investmentData
            });
            return createdInvestment;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.createPrismaInvestment = createPrismaInvestment;
function filterPrismaInvestmentByID(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Query com todos os dados
            const investment = yield prisma_1.prisma.investment.findUnique({
                where: { id }
            });
            return investment;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.filterPrismaInvestmentByID = filterPrismaInvestmentByID;
function filterPrismaInvestment(listInvestmentData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { title, investmentValue, companyName, expectedDeliveryDateInitial, expectedDeliveryDateFinal, city, projectManagerID, active, page, pageRange } = listInvestmentData;
            // Sem filtros, só paginação
            if (!title &&
                !investmentValue &&
                !companyName &&
                !expectedDeliveryDateInitial &&
                !expectedDeliveryDateFinal &&
                !city &&
                !projectManagerID &&
                !active) {
                const filteredInvestment = yield prisma_1.prisma.investment.findMany({
                    skip: (page - 1) * pageRange,
                    take: pageRange,
                });
                return filteredInvestment;
            }
            // Modelagem de datas
            let expectedDeliveryDateInitialISO;
            if (expectedDeliveryDateInitial) {
                expectedDeliveryDateInitialISO = new Date(expectedDeliveryDateInitial).toISOString();
            }
            let expectedDeliveryDateFinalISO;
            if (expectedDeliveryDateFinal) {
                expectedDeliveryDateFinalISO = new Date(expectedDeliveryDateFinal).toISOString();
            }
            // Query para usar no FindMany
            const andConditions = [
                { title },
                { investmentValue },
                { companyName },
                { projectManagerID },
                { active },
                {
                    expectedDeliveryDate: {
                        gte: expectedDeliveryDateInitial ? expectedDeliveryDateInitialISO : undefined,
                        lte: expectedDeliveryDateFinal ? expectedDeliveryDateFinalISO : undefined,
                    },
                },
            ];
            // Condição para filtrar por Cidade (caso City não exista)
            if (city) {
                andConditions.push({
                    address: {
                        city: city,
                    },
                });
            }
            // Query com todos os dados
            const filteredInvestment = yield prisma_1.prisma.investment.findMany({
                where: {
                    AND: andConditions
                },
                skip: (page - 1) * pageRange,
                take: pageRange,
                orderBy: [
                    {
                        title: 'asc'
                    }
                ]
            });
            return filteredInvestment;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.filterPrismaInvestment = filterPrismaInvestment;
function updatePrismaInvestment(investmentData, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const investmentExists = yield prisma_1.prisma.investment.findFirst({
                where: { id }
            });
            if (!investmentExists) {
                throw Error("O empreendimento informado não existe.");
            }
            const { launchDate, constructionStartDate, expectedDeliveryDate } = investmentData;
            // Modelagem de datas
            if (launchDate) {
                investmentData.launchDate = new Date(launchDate);
            }
            if (constructionStartDate) {
                investmentData.constructionStartDate = new Date(constructionStartDate);
            }
            if (expectedDeliveryDate) {
                investmentData.expectedDeliveryDate = new Date(expectedDeliveryDate);
            }
            const updatedInvestment = yield prisma_1.prisma.investment.update({
                where: { id },
                data: investmentData
            });
            return updatedInvestment;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.updatePrismaInvestment = updatePrismaInvestment;
function deletePrismaInvestment(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const investmentExists = yield prisma_1.prisma.investment.findFirst({
                where: { id }
            });
            if (!investmentExists) {
                throw Error("O empreendimento informado não existe.");
            }
            const deletedInvestment = yield prisma_1.prisma.investment.delete({ where: { id } });
            return deletedInvestment;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.deletePrismaInvestment = deletePrismaInvestment;
function deletePrismaInvestmentImage(investmentID, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const investmentExists = yield prisma_1.prisma.investment.findFirst({
                where: { id: investmentID }
            });
            if (!investmentExists) {
                throw Error("O empreendimento informado não existe.");
            }
            const updatedInvestment = yield prisma_1.prisma.investment.update({
                where: { id: investmentID },
                data: {
                    images: {
                        deleteMany: {
                            where: { id: id },
                        },
                    },
                },
            });
            return updatedInvestment.images;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.deletePrismaInvestmentImage = deletePrismaInvestmentImage;
function deletePrismaInvestmentDocument(investmentID, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const investmentExists = yield prisma_1.prisma.investment.findFirst({
                where: { id: investmentID }
            });
            if (!investmentExists) {
                throw Error("O empreendimento informado não existe.");
            }
            const updatedInvestment = yield prisma_1.prisma.investment.update({
                where: { id: investmentID },
                data: {
                    documents: {
                        deleteMany: {
                            where: { id: id },
                        },
                    },
                },
            });
            console.log(updatedInvestment.documents);
            return updatedInvestment.documents;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.deletePrismaInvestmentDocument = deletePrismaInvestmentDocument;
function deletePrismaInvestmentPartner(investmentID, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const investmentExists = yield prisma_1.prisma.investment.findFirst({
                where: { id: investmentID }
            });
            if (!investmentExists) {
                throw Error("O empreendimento informado não existe.");
            }
            const updatedInvestment = yield prisma_1.prisma.investment.update({
                where: { id: investmentID },
                data: {
                    partners: {
                        deleteMany: {
                            where: { id: id },
                        },
                    },
                },
            });
            console.log(updatedInvestment.partners);
            return updatedInvestment.partners;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.deletePrismaInvestmentPartner = deletePrismaInvestmentPartner;
function importPrismaInvestmentProgress(worksheet, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const investmentExists = yield prisma_1.prisma.investment.findFirst({
                where: { id: id }
            });
            if (!investmentExists) {
                throw Error("O empreendimento informado não existe.");
            }
            const financialTotalProgress = [];
            const buildingTotalProgress = [];
            // Começa da segunda linha, pois a primeira linha é o cabeçalho
            for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
                const row = worksheet.getRow(rowNumber);
                // Extrai os dados da linha
                const data = row.getCell(1).value; // Se o valor for null ou undefined, define como string vazia
                const financeiroPrevisto = Math.round(parseFloat(parseFloat(row.getCell(2).text).toFixed(2)));
                const financeiroRealizado = Math.round(parseFloat(parseFloat(row.getCell(3).text).toFixed(2)));
                const obraPrevisto = parseFloat(parseFloat(row.getCell(4).text.replace('%', '')).toFixed(2));
                const obraRealizado = parseFloat(parseFloat(row.getCell(5).text.replace('%', '')).toFixed(2));
                // Adiciona os dados aos arrays
                financialTotalProgress.push({
                    data: data,
                    previsto: financeiroPrevisto,
                    realizado: financeiroRealizado,
                });
                buildingTotalProgress.push({
                    data: data,
                    previsto: obraPrevisto,
                    realizado: obraRealizado,
                });
            }
            const updatedInvestment = yield prisma_1.prisma.investment.update({
                where: { id: id },
                data: {
                    financialTotalProgress: financialTotalProgress,
                    buildingTotalProgress: buildingTotalProgress
                }
            });
            return (updatedInvestment);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.importPrismaInvestmentProgress = importPrismaInvestmentProgress;
function criarTiposApartamento(worksheet) {
    const tiposApartamentoSet = new Set(); // Cria um Set para armazenar os tipos únicos
    // Itera sobre as linhas da planilha (a partir da segunda linha)
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);
        // Itera sobre as células da linha (a partir da segunda célula)
        for (let colNumber = 2; colNumber <= row.cellCount; colNumber++) {
            const valorCelula = row.getCell(colNumber).value;
            if (valorCelula && typeof valorCelula === 'string') {
                // Divide o valor da célula em metragem e descrição
                const [metragem, descricao] = valorCelula.split(';');
                // Cria uma chave única combinando metragem e descrição
                const chaveUnica = `${metragem};${descricao}`;
                // Adiciona a chave única ao Set
                tiposApartamentoSet.add(chaveUnica);
            }
        }
    }
    // Converte o Set em um array de objetos ApartamentTypes
    const tiposApartamento = Array.from(tiposApartamentoSet).map((tipo) => {
        const [metragem, descricao] = tipo.split(';');
        return {
            id: (0, uuid_1.v4)(),
            metragem,
            description: descricao,
            fotos: [],
            plantas: [],
            media360: {
                salaDeEstar: [],
                salaDeJantar: [],
                cozinha: [],
                quarto1: [],
                quarto2: [],
                quarto3: [],
                banheiro1: [],
                banheiro2: [],
                banheiro3: [],
                sacada: [],
                lavanderia: [],
                hall: []
            }
        };
    });
    return tiposApartamento;
}
function criarApartamentos(worksheet, tiposApartamento) {
    const apartamentos = [];
    // Itera sobre as linhas da planilha (a partir da segunda linha)
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);
        // Itera sobre as células da linha (a partir da segunda célula)
        for (let colNumber = 2; colNumber <= row.cellCount; colNumber++) {
            const valorCelula = row.getCell(colNumber).value;
            const andar = row.getCell(1).value;
            const firstRow = worksheet.getRow(1);
            const final = firstRow.getCell(colNumber).value;
            if (valorCelula && typeof valorCelula === 'string') {
                // Divide o valor da célula em metragem e descrição
                const [metragem, descricao] = valorCelula.split(';');
                // Encontra o tipo de apartamento correspondente
                const tipoApartamento = tiposApartamento.find((tipo) => tipo.metragem === metragem && tipo.description === descricao);
                if (!tipoApartamento) {
                    throw new Error(`Tipo de apartamento não encontrado para metragem ${metragem} e descrição ${descricao}`);
                }
                apartamentos.push({
                    id: (0, uuid_1.v4)(),
                    andar: String(andar),
                    final: String(final),
                    metragem,
                    userId: null,
                    tipoId: tipoApartamento.id
                });
            }
        }
    }
    return apartamentos;
}
function importInvestmentUnidades(worksheet, id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const investmentExists = yield prisma_1.prisma.investment.findFirst({
                where: { id: id }
            });
            if (!investmentExists) {
                throw Error("O empreendimento informado não existe.");
            }
            const tiposApartamento = criarTiposApartamento(worksheet);
            const apartamentos = criarApartamentos(worksheet, tiposApartamento);
            const updatedInvestment = yield prisma_1.prisma.investment.update({
                where: { id: id },
                data: {
                    apartamentTypes: tiposApartamento,
                    apartaments: apartamentos
                }
            });
            return updatedInvestment;
        }
        catch (error) {
            throw error;
        }
    });
}
exports.importInvestmentUnidades = importInvestmentUnidades;
function validatePageParams(listInvestmentData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { page, pageRange } = listInvestmentData;
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
