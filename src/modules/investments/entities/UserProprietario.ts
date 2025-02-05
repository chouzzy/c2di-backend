import { UserProprietario } from "@prisma/client";

class UserProprietarioEntity {
  
  id!: UserProprietario["id"]

  userID!: UserProprietario["userID"]

  investmentID!: UserProprietario["investmentID"]
  apartamentID!: UserProprietario["apartamentID"]
  
  investedValue!: UserProprietario["investedValue"]
  valorCorrente!: UserProprietario["valorCorrente"]
  documents!: UserProprietario["documents"]
  dataInvestimento!: UserProprietario["dataInvestimento"]


  createdAt!: UserProprietario["createdAt"]
  updatedAt!: UserProprietario["updatedAt"]

}

export { UserProprietarioEntity }