import { InvestmentEntity } from "../modules/investments/entities/Investments";
import { CreateInvestmentRequestProps } from "../modules/investments/useCases/Investments/createInvestment/CreateInvestmentController";
import { ListInvestmentRequestProps } from "../modules/investments/useCases/Investments/listInvestment/ListInvestmentsController";
import { ListInvestmentProps } from "../modules/investments/useCases/Investments/listInvestment/ListInvestmentsUseCase";
import { UpdateInvestmentRequestProps } from "../modules/investments/useCases/Investments/updateInvestment/UpdateInvestmentController";
import { prisma } from "../prisma";


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
        investmentData.investmentDate = new Date(investmentData.investmentDate)

        const titleExists = await prisma.investment.findFirst({
            where: { title: investmentData.title }
        })

        if (titleExists) {
            throw Error("Título já existente.")
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
            !city
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

export { createPrismaInvestment, filterPrismaInvestment, updatePrismaInvestment, deletePrismaInvestment, filterPrismaInvestmentByID, validatePageParams }