import { Worksheet } from "exceljs";
import { InvestmentEntity } from "../modules/investments/entities/Investments";
import { CreateInvestmentRequestProps } from "../modules/investments/useCases/Investments/createInvestment/CreateInvestmentController";
import { ListInvestmentRequestProps } from "../modules/investments/useCases/Investments/listInvestment/ListInvestmentsController";
import { ListInvestmentProps } from "../modules/investments/useCases/Investments/listInvestment/ListInvestmentsUseCase";
import { UpdateInvestmentRequestProps } from "../modules/investments/useCases/Investments/updateInvestment/UpdateInvestmentController";
import { prisma } from "../prisma";
import { Investment } from "@prisma/client";
import { v4 as uuidv4 } from 'uuid';


async function createPrismaInvestment(investmentData: CreateInvestmentRequestProps) {

    try {

        investmentData.launchDate = new Date(investmentData.launchDate)
        investmentData.constructionStartDate = new Date(investmentData.constructionStartDate)
        investmentData.expectedDeliveryDate = new Date(investmentData.expectedDeliveryDate)

        if (investmentData.finishDate) {

            investmentData.finishDate = new Date(investmentData.finishDate)
        } else {
            investmentData.finishDate = new Date('2030-12-12')

        }

        const { investmentDate } = investmentData

        if (investmentDate) {
            investmentData.investmentDate = new Date(investmentDate)
        }

        const titleExists = await prisma.investment.findFirst({
            where: { title: investmentData.title }
        })

        if (titleExists) {
            throw Error("Título já existente.")
        }

        const { buildingTotalProgress, financialTotalProgress, buildingProgress } = investmentData
        if (!buildingTotalProgress) { investmentData.buildingTotalProgress = [{ data: new Date(), previsto: 0, realizado: 0 }] }
        if (!financialTotalProgress) { investmentData.financialTotalProgress = [{ data: new Date(), previsto: 0, realizado: 0 }] }

        if (!buildingProgress) {
            investmentData.buildingProgress = {
                acabamento: 0,
                alvenaria: 0,
                estrutura: 0,
                fundacao: 0,
                instalacoes: 0,
                pintura: 0
            }
        }

        const createdInvestment = await prisma.investment.create({
            data: investmentData
        })

        return createdInvestment

    } catch (error) {
        throw error
    }

}

async function filterPrismaInvestmentByID(id: InvestmentEntity["id"]) {

    try {

        // Query com todos os dados
        const investment = await prisma.investment.findUnique({
            where: { id }
        })

        return investment

    } catch (error) {
        throw error
    }

}

async function filterPrismaInvestment(listInvestmentData: ListInvestmentProps) {

    try {

        const {
            title,
            investmentValue,
            companyName,
            expectedDeliveryDateInitial,
            expectedDeliveryDateFinal,
            city,
            projectManagerID,
            active,
            page,
            pageRange
        } = listInvestmentData


        // Sem filtros, só paginação
        if (
            !title &&
            !investmentValue &&
            !companyName &&
            !expectedDeliveryDateInitial &&
            !expectedDeliveryDateFinal &&
            !city &&
            !projectManagerID &&
            !active
        ) {

            const filteredInvestment = await prisma.investment.findMany({
                skip: (page - 1) * pageRange,
                take: pageRange,
            })

            return filteredInvestment
        }

        // Modelagem de datas
        let expectedDeliveryDateInitialISO
        if (expectedDeliveryDateInitial) { expectedDeliveryDateInitialISO = new Date(expectedDeliveryDateInitial).toISOString() }

        let expectedDeliveryDateFinalISO
        if (expectedDeliveryDateFinal) { expectedDeliveryDateFinalISO = new Date(expectedDeliveryDateFinal).toISOString() }

        // Query para usar no FindMany
        const andConditions: any = [
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
        const filteredInvestment = await prisma.investment.findMany({
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
        })

        return filteredInvestment

    } catch (error) {
        throw error
    }

}

async function updatePrismaInvestment(investmentData: UpdateInvestmentRequestProps, id: InvestmentEntity["id"]) {

    try {

        const investmentExists = await prisma.investment.findFirst({
            where: { id }
        })

        if (!investmentExists) {
            throw Error("O empreendimento informado não existe.")
        }

        const { launchDate, constructionStartDate, expectedDeliveryDate } = investmentData
        // Modelagem de datas
        if (launchDate) { investmentData.launchDate = new Date(launchDate) }
        if (constructionStartDate) { investmentData.constructionStartDate = new Date(constructionStartDate) }
        if (expectedDeliveryDate) { investmentData.expectedDeliveryDate = new Date(expectedDeliveryDate) }

        const updatedInvestment = await prisma.investment.update({
            where: { id },
            data: investmentData
        })

        return updatedInvestment

    } catch (error) {
        throw error
    }
}

async function deletePrismaInvestment(id: InvestmentEntity["id"]) {

    try {

        const investmentExists = await prisma.investment.findFirst({
            where: { id }
        })

        if (!investmentExists) {
            throw Error("O empreendimento informado não existe.")
        }

        const deletedInvestment = await prisma.investment.delete({ where: { id } })

        return deletedInvestment

    } catch (error) {
        throw error
    }
}

async function deletePrismaInvestmentImage(investmentID: InvestmentEntity["id"], id: InvestmentEntity["photos"][0]["images"][0]["id"]) {

    try {

        const investmentFound = await prisma.investment.findFirst({
            where: { id: investmentID },
        })

        if (!investmentFound) {
            throw Error("O empreendimento informado não existe.")
        }

        let groupIndex = -1;
        let imageIndex = -1;

        for (let i = 0; i < investmentFound.photos.length; i++) {
            const group = investmentFound.photos[i];
            imageIndex = group.images.findIndex((image) => image.id === id);
            if (imageIndex !== -1) {
                groupIndex = i;
                break; // Importante: parar o loop quando encontrar
            }
        }

        if (groupIndex === -1 || imageIndex === -1) {
            throw new Error("Imagem não encontrada.");
        }

        // 3. Filtrar o array de imagens (dentro do grupo)
        const updatedImages = investmentFound.photos[groupIndex].images.filter(
            (image) => image.id !== id
        );

        // 4. Atualiza o array de photos
        const updatedPhotos = investmentFound.photos.map((group, index) => {
            if (index === groupIndex) {
                return { ...group, images: updatedImages }
            }
            return group
        })

        // 5. Atualizar *todo* o array 'photos', usando update + data
        const updatedInvestment = await prisma.investment.update({
            where: { id: investmentID },
            data: {
                photos: {
                    set: updatedPhotos //Substitui o array inteiro
                }
            }
        });
        return updatedInvestment;

    } catch (error) {
        throw error
    }
}

async function deletePrismaInvestmentDocument(investmentID: InvestmentEntity["id"], id: InvestmentEntity["documents"][0]["id"]) {

    try {

        const investmentExists = await prisma.investment.findFirst({
            where: { id: investmentID }
        })

        if (!investmentExists) {
            throw Error("O empreendimento informado não existe.")
        }

        const updatedInvestment = await prisma.investment.update({
            where: { id: investmentID },
            data: {
                documents: {
                    deleteMany: {
                        where: { id: id },
                    },
                },
            },
        });

        console.log(updatedInvestment.documents)

        return updatedInvestment.documents

    } catch (error) {
        throw error
    }
}


async function deletePrismaInvestmentPartner(investmentID: InvestmentEntity["id"], id: InvestmentEntity["partners"][0]["id"]) {

    try {

        const investmentExists = await prisma.investment.findFirst({
            where: { id: investmentID }
        })

        if (!investmentExists) {
            throw Error("O empreendimento informado não existe.")
        }

        const updatedInvestment = await prisma.investment.update({
            where: { id: investmentID },
            data: {
                partners: {
                    deleteMany: {
                        where: { id: id },
                    },
                },
            },
        });

        console.log(updatedInvestment.partners)

        return updatedInvestment.partners

    } catch (error) {
        throw error
    }
}

async function importPrismaInvestmentProgress(worksheet: Worksheet, id: Investment["id"]) {

    try {

        const investmentExists = await prisma.investment.findFirst({
            where: { id: id }
        })

        if (!investmentExists) {
            throw Error("O empreendimento informado não existe.")
        }


        const financialTotalProgress: Investment["financialTotalProgress"] = [];
        const buildingTotalProgress: Investment["buildingTotalProgress"] = [];

        // Começa da segunda linha, pois a primeira linha é o cabeçalho
        for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
            const row = worksheet.getRow(rowNumber);
            // Extrai os dados da linha
            const data = row.getCell(1).value as Date; // Se o valor for null ou undefined, define como string vazia
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

        const updatedInvestment = await prisma.investment.update({
            where: { id: id },
            data: {
                financialTotalProgress: financialTotalProgress,
                buildingTotalProgress: buildingTotalProgress
            }
        })

        return (updatedInvestment)

    } catch (error) {
        throw error
    }
}

function criarTiposApartamento(worksheet: Worksheet): Investment["apartamentTypes"] {
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
    const tiposApartamento: Investment["apartamentTypes"] = Array.from(tiposApartamentoSet).map((tipo: any) => {
        const [metragem, descricao] = tipo.split(';');
        return {
            id: uuidv4(),
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

function criarApartamentos(worksheet: Worksheet, tiposApartamento: Investment["apartamentTypes"]): Investment['apartaments'] {

    const apartamentos: Investment['apartaments'] = [];

    // Itera sobre as linhas da planilha (a partir da segunda linha)
    for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
        const row = worksheet.getRow(rowNumber);

        // Itera sobre as células da linha (a partir da segunda célula)
        for (let colNumber = 2; colNumber <= row.cellCount; colNumber++) {
            const valorCelula = row.getCell(colNumber).value;
            const andar = row.getCell(1).value
            const firstRow = worksheet.getRow(1)
            const final = firstRow.getCell(colNumber).value

            if (valorCelula && typeof valorCelula === 'string') {
                // Divide o valor da célula em metragem e descrição
                const [metragem, descricao] = valorCelula.split(';');

                // Encontra o tipo de apartamento correspondente
                const tipoApartamento = tiposApartamento.find(
                    (tipo) => tipo.metragem === metragem && tipo.description === descricao
                );

                if (!tipoApartamento) {
                    throw new Error(`Tipo de apartamento não encontrado para metragem ${metragem} e descrição ${descricao}`);
                }

                apartamentos.push({
                    id: uuidv4(),
                    andar: String(andar), // Converte o número do andar para string
                    final: String(final), // Converte o número do final para string
                    metragem,
                    userId: null, // userId obtido da sua lógica
                    tipoId: tipoApartamento.id
                });
            }
        }

    }

    return apartamentos;
}

async function importInvestmentUnidades(worksheet: Worksheet, id: Investment["id"]) {

    try {

        const investmentExists = await prisma.investment.findFirst({
            where: { id: id }
        })

        if (!investmentExists) {
            throw Error("O empreendimento informado não existe.")
        }

        const tiposApartamento = criarTiposApartamento(worksheet);
        const apartamentos = criarApartamentos(worksheet, tiposApartamento);

        const updatedInvestment = await prisma.investment.update({
            where: { id: id },
            data: {
                apartamentTypes: tiposApartamento,
                apartaments: apartamentos
            }
        })

        return updatedInvestment
    } catch (error) {
        throw error
    }
}

function isValidDate(date: Date) {
    return date instanceof Date && !isNaN(date.getTime());
}

function converterExcelEmArrayMetroQuadrado(worksheet: Worksheet): Investment["valorMetroQuadrado"] {
    const resultArray: Investment["valorMetroQuadrado"] = [];


    worksheet.eachRow((row, rowNumber) => {
        // Ignora a primeira linha (cabeçalho)
        if (rowNumber === 1) return;

        const id = uuidv4();

        // Obtém o valor da célula da coluna "Valor" (coluna A neste caso)
        const valorCell = row.getCell(1).text;
        console.log('valorCell')
        console.log(valorCell)
        if (!valorCell) {
            console.error(`Valor ausente na linha ${rowNumber}, coluna "Valor".`);
            return; // Ou lançar um erro: throw new Error(`Valor ausente na linha ${rowNumber}`);
        }

        const valor = parseFloat(
            valorCell.toString().replace("R$ ", "").replace(",", ".")
        );

        if (isNaN(valor)) {
            console.error(`Valor inválido na linha ${rowNumber}, coluna "Valor": ${valorCell}`);
            return; // Ou lançar um erro
        }

        // Obtém o valor da célula da coluna "Data" (coluna B neste caso)
        const dataCell = row.getCell(2).text;

        if (!dataCell) {
            console.error(`Data ausente na linha ${rowNumber}, coluna "Data".`);
            return; // Ou lançar um erro
        }

        const dataOriginal = new Date(dataCell.toString());

        if (!isValidDate(dataOriginal)) {
            console.error(`Data inválida na linha ${rowNumber}: ${dataCell}`);
            return; // Ou lançar um erro
        }

        const data = new Date(
            dataOriginal.getFullYear(),
            dataOriginal.getMonth(),
            dataOriginal.getDate()
        );

        resultArray.push({ id, valor, data });
    });

    return resultArray
}

async function importInvestmentMetroQuadrado(worksheet: Worksheet, id: Investment["id"]) {

    try {

        const investmentExists = await prisma.investment.findFirst({
            where: { id: id }
        })

        if (!investmentExists) {
            throw Error("O empreendimento informado não existe.")
        }

        const valorMetroQuadrado = converterExcelEmArrayMetroQuadrado(worksheet);


        const updatedInvestment = await prisma.investment.update({
            where: { id: id },
            data: {
                valorMetroQuadrado: valorMetroQuadrado,
            }
        })

        return updatedInvestment
    } catch (error) {
        throw error
    }
}


async function validatePageParams(listInvestmentData: ListInvestmentRequestProps) {

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
    } catch (error) {
        throw error;
    }
}

export { createPrismaInvestment, filterPrismaInvestment, updatePrismaInvestment, deletePrismaInvestment, filterPrismaInvestmentByID, deletePrismaInvestmentImage, validatePageParams, deletePrismaInvestmentDocument, deletePrismaInvestmentPartner, importPrismaInvestmentProgress, importInvestmentUnidades, importInvestmentMetroQuadrado }