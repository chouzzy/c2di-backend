import { UserInvestmentEntity } from "../modules/investments/entities/UserInvestment";
import { CreateUserInvestmentRequestProps } from "../modules/investments/useCases/UserInvestment/createUserInvestment/CreateUserInvestmentController";
import { ListUserInvestmentRequestProps } from "../modules/investments/useCases/UserInvestment/listUserInvestments/ListUserInvestmentsController";
import { ListUserInvestmentFormatted } from "../modules/investments/useCases/UserInvestment/listUserInvestments/ListUserInvestmentsUseCase";
import { prisma } from "../prisma";


async function createPrismaUserInvestment(userInvestmentData: CreateUserInvestmentRequestProps) {

    try {

        const { userID, investmentID, investedValue, valorCorrente, dataInvestimento, documents, apartament } = userInvestmentData

        const userInvestment = await prisma.userInvestment.create({
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
                apartament: apartament
            }
        })

        return userInvestment

    } catch (error) {
        throw error
    }
}
async function filterPrismaUserInvestment(listUserInvestmentData: ListUserInvestmentFormatted) {

    try {

        const { userID, investmentID, page, pageRange } = listUserInvestmentData


        if (!userID && !investmentID) {

            const userInvestment = await prisma.userInvestment.findMany({
                skip: (page - 1) * pageRange,
                take: pageRange,
            })

            return userInvestment
        }


        const userInvestment = await prisma.userInvestment.findMany({
            where: {
                AND: [
                    { userID },
                    { investmentID }
                ]
            },
            skip: (page - 1) * pageRange,
            take: pageRange,
        })

        return userInvestment

    } catch (error) {
        throw error
    }
}

async function filterPrismaInvestmentsByUserID(listUserInvestmentData: ListUserInvestmentFormatted) {

    try {

        const { userID, page, pageRange } = listUserInvestmentData

        // PEGA A LISTA DE INVESTIMENTOS DESSE USUARIO
        const userInvestmentList = await prisma.userInvestment.findMany({
            where: { userID: userID },
            skip: (page - 1) * pageRange,
            take: pageRange,
        })

        // LISTA OS IDS DO INVESTIMENTO
        const investmentIDs = userInvestmentList.map((userInvestment) => { return userInvestment.investmentID })

        // FILTRA TODOS OS INVESTIMENTOS QUE POSSUEM OS IDS ENCONTRADOS
        const investments = await prisma.investment.findMany({
            where: {
                id: {
                    in: investmentIDs, // Filtra os investimentos com base na lista de IDs
                },
            },
        });

        return investments




    } catch (error) {
        throw error
    }
}

async function filterPrismaInvestmentsByInvestmentID(listUserInvestmentData: ListUserInvestmentFormatted) {

    try {

        const { investmentID, page, pageRange } = listUserInvestmentData

        // PEGA A LISTA DE INVESTIMENTOS DESSE USUARIO
        const userInvestmentList = await prisma.userInvestment.findMany({
            where: { investmentID: investmentID },
            skip: (page - 1) * pageRange,
            take: pageRange,
        })

        // LISTA OS IDS DO INVESTIMENTO
        const userIDs = userInvestmentList.map((userInvestment) => { return userInvestment.userID })

        // FILTRA TODOS OS INVESTIMENTOS QUE POSSUEM OS IDS ENCONTRADOS
        const users = await prisma.users.findMany({
            where: {
                id: {
                    in: userIDs, // Filtra os investimentos com base na lista de IDs
                },
            },
        });

        return users

    } catch (error) {
        throw error
    }
}

async function filterPrismaUserInvestmentsByInvestmentID(listUserInvestmentData: ListUserInvestmentFormatted) {

    try {

        const { investmentID, page, pageRange } = listUserInvestmentData

        // PEGA A LISTA DE INVESTIMENTOS NESSE PROJETO
        const userInvestmentList = await prisma.userInvestment.findMany({
            where: { investmentID: investmentID },
            skip: (page - 1) * pageRange,
            take: pageRange,
        })

        return userInvestmentList

    } catch (error) {
        throw error
    }
}

async function filterPrismaUserInvestmentsByUserID(listUserInvestmentData: ListUserInvestmentFormatted) {

    try {

        const { userID, page, pageRange } = listUserInvestmentData

        // PEGA A LISTA DE INVESTIMENTOS NESSE PROJETO
        const userInvestmentList = await prisma.userInvestment.findMany({
            where: { userID: userID },
            skip: (page - 1) * pageRange,
            take: pageRange,
        })

        return userInvestmentList

    } catch (error) {
        throw error
    }
}


async function deletePrismaUserInvestments(id: UserInvestmentEntity["id"]) {
    // A função é assíncrona e recebe o ID do UserInvestment que será deletado
  
    try {
      // Inicia um bloco try...catch para tratamento de erros
  
      // Busca o UserInvestment pelo ID fornecido
      const userInvestmentFound = await prisma.userInvestment.findFirst({
        where: { id: id },
      });
      console.log("userInvestmentFound");
      console.log(userInvestmentFound);
  
      // Verifica se o UserInvestment foi encontrado
      if (!userInvestmentFound) {
        throw Error("Investimento não encontrado");
      }
  
      // Busca o Investment (empreendimento) relacionado ao UserInvestment encontrado
      const investment = await prisma.investment.findUnique({
        where: { id: userInvestmentFound.investmentID }
      });
  
      // Verifica se o Investment foi encontrado
      if (!investment) {
        throw Error("Empreendimento não encontrado.");
      }
  
      // Encontra o índice do apartamento (no array apartaments do Investment) que será atualizado
      const apartmentIndex = investment.apartaments.findIndex(
        (apartment) => apartment.id === userInvestmentFound.apartament?.id
      );
  
      // Verifica se o apartamento foi encontrado no array
      if (apartmentIndex === -1) {
        throw Error("Apartamento não encontrado no array.");
      }
  
      // Cria um novo array de apartamentos, atualizando o userId do apartamento específico para null
      const updatedApartaments = investment.apartaments.map(
        (apartament) => {
          if (apartament.id === userInvestmentFound.apartament?.id) {
            return {
              ...apartament, // Copia todas as propriedades do apartamento atual
              userId: null, // Define userId como null (desassocia o usuário)
            };
          }
          return apartament; // Mantém os outros apartamentos inalterados
        }
      );
  
      // Atualiza o Investment no banco de dados, substituindo o array apartaments pelo novo array
      const investmentUpdated = await prisma.investment.update({
        where: { id: userInvestmentFound.investmentID },
        data: {
          apartaments: updatedApartaments, // Substitui o array inteiro de apartamentos
        },
      });
  
      // Verifica se a atualização do Investment foi bem-sucedida
      if (!investmentUpdated) {
        throw Error("Ocorreu um erro ao atualizar o apartamento");
      }
  
      // Deleta o UserInvestment (o registro que relaciona usuário e investimento)
      const userInvestmentDeleted = await prisma.userInvestment.delete({
        where: { id: id },
      });
  
      // Retorna o UserInvestment que foi deletado
      return userInvestmentDeleted;
    } catch (error) {
      // Captura e lança qualquer erro ocorrido no bloco try
      throw error;
    }
  }


async function validatePageParams(listUserInvestmentData: ListUserInvestmentRequestProps) {

    try {
        const { page, pageRange } = listUserInvestmentData;

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

export { createPrismaUserInvestment, filterPrismaUserInvestment, filterPrismaInvestmentsByUserID, filterPrismaInvestmentsByInvestmentID, filterPrismaUserInvestmentsByInvestmentID, deletePrismaUserInvestments, validatePageParams, filterPrismaUserInvestmentsByUserID }