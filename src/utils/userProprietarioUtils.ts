import { UserProprietarioEntity } from "../modules/investments/entities/UserProprietario";
import { CreateUserProprietarioRequestProps } from "../modules/investments/useCases/UserProprietario/createUserProprietario/CreateUserProprietarioController";
import { ListUserProprietarioRequestProps } from "../modules/investments/useCases/UserProprietario/listUserProprietario/ListUserProprietariosController";
import { ListUserProprietarioFormatted } from "../modules/investments/useCases/UserProprietario/listUserProprietario/ListUserProprietariosUseCase";
import { prisma } from "../prisma";


async function createPrismaUserProprietario(userProprietarioData: CreateUserProprietarioRequestProps) {

    try {

        const { userID, investmentID, investedValue, valorCorrente, dataInvestimento, documents, apartamentID } = userProprietarioData

        const userProprietario = await prisma.userProprietario.create({
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
        })

        return userProprietario

    } catch (error) {
        throw error
    }
}
async function filterPrismaUserProprietario(listUserProprietarioData: ListUserProprietarioFormatted) {

    try {

        const { userID, investmentID, page, pageRange } = listUserProprietarioData


        if (!userID && !investmentID) {

            const userProprietario = await prisma.userProprietario.findMany({
                skip: (page - 1) * pageRange,
                take: pageRange,
            })

            return userProprietario
        }


        const userProprietario = await prisma.userProprietario.findMany({
            where: {
                AND: [
                    { userID },
                    { investmentID }
                ]
            },
            skip: (page - 1) * pageRange,
            take: pageRange,
        })

        return userProprietario

    } catch (error) {
        throw error
    }
}

async function filterPrismaInvestmentsByUserID(listUserProprietarioData: ListUserProprietarioFormatted) {

    try {

        const { userID, page, pageRange } = listUserProprietarioData

        // PEGA A LISTA DE INVESTIMENTOS DESSE USUARIO
        const userProprietarioList = await prisma.userProprietario.findMany({
            where: { userID: userID },
            skip: (page - 1) * pageRange,
            take: pageRange,
        })

        // LISTA OS IDS DO INVESTIMENTO
        const investmentIDs = userProprietarioList.map((userProprietario) => { return userProprietario.investmentID })

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

async function filterPrismaInvestmentsByInvestmentID(listUserProprietarioData: ListUserProprietarioFormatted) {

    try {

        const { investmentID, page, pageRange } = listUserProprietarioData

        // PEGA A LISTA DE INVESTIMENTOS DESSE USUARIO
        const userProprietarioList = await prisma.userProprietario.findMany({
            where: { investmentID: investmentID },
            skip: (page - 1) * pageRange,
            take: pageRange,
        })

        // LISTA OS IDS DO INVESTIMENTO
        const userIDs = userProprietarioList.map((userProprietario) => { return userProprietario.userID })

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

async function filterPrismaUserProprietariosByInvestmentID(listUserProprietarioData: ListUserProprietarioFormatted) {

    try {

        const { investmentID, page, pageRange } = listUserProprietarioData

        // PEGA A LISTA DE INVESTIMENTOS NESSE PROJETO
        const userProprietarioList = await prisma.userProprietario.findMany({
            where: { investmentID: investmentID },
            skip: (page - 1) * pageRange,
            take: pageRange,
        })

        return userProprietarioList

    } catch (error) {
        throw error
    }
}


async function deletePrismaUserProprietarios(id: UserProprietarioEntity["id"]) {
    try {
      // Inicia um bloco try...catch para tratamento de erros
  
      // Busca o UserInvestment pelo ID fornecido
      const userProprietarioFound = await prisma.userProprietario.findFirst({
        where: { id: id },
      });
      console.log("userProprietarioFound");
      console.log(userProprietarioFound);
  
      // Verifica se o UserInvestment foi encontrado
      if (!userProprietarioFound) {
        throw Error("Investimento não encontrado");
      }
  
      // Busca o Investment (empreendimento) relacionado ao UserInvestment encontrado
      const investment = await prisma.investment.findUnique({
        where: { id: userProprietarioFound.investmentID }
      });
  
      // Verifica se o Investment foi encontrado
      if (!investment) {
        throw Error("Empreendimento não encontrado.");
      }
  
      // Encontra o índice do apartamento (no array apartaments do Investment) que será atualizado
      const apartmentIndex = investment.apartaments.findIndex(
        (apartment) => apartment.id === userProprietarioFound.apartamentID
      );
  
      // Verifica se o apartamento foi encontrado no array
      if (apartmentIndex === -1) {
        throw Error("Apartamento não encontrado no array.");
      }
  
      // Cria um novo array de apartamentos, atualizando o userId do apartamento específico para null
      const updatedApartaments = investment.apartaments.map(
        (apartament) => {
          if (apartament.id === userProprietarioFound.apartamentID) {
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
        where: { id: userProprietarioFound.investmentID },
        data: {
          apartaments: updatedApartaments, // Substitui o array inteiro de apartamentos
        },
      });
  
      // Verifica se a atualização do Investment foi bem-sucedida
      if (!investmentUpdated) {
        throw Error("Ocorreu um erro ao atualizar o apartamento");
      }
  
      // Deleta o UserInvestment (o registro que relaciona usuário e investimento)
      const userProprietarioDeleted = await prisma.userProprietario.delete({
        where: { id: id },
      });
  
      // Retorna o UserInvestment que foi deletado
      return userProprietarioDeleted;
    } catch (error) {
      // Captura e lança qualquer erro ocorrido no bloco try
      throw error;
    }
  }

async function validatePageParams(listUserProprietarioData: ListUserProprietarioRequestProps) {

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
    } catch (error) {
        throw error;
    }
}

export { createPrismaUserProprietario, filterPrismaUserProprietario, filterPrismaInvestmentsByUserID, filterPrismaInvestmentsByInvestmentID, filterPrismaUserProprietariosByInvestmentID, deletePrismaUserProprietarios, validatePageParams }