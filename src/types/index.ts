import { Prisma } from "@prisma/client";
import { UsersEntity } from "../modules/registrations/entities/Users";
import Stripe from "stripe";
import { UserInvestmentEntity } from "../modules/investments/entities/UserInvestment";
import { InvestmentEntity } from "../modules/investments/entities/Investments";
import { UserProprietarioEntity } from "../modules/investments/entities/UserProprietario";

interface usersResumed {
  id: UsersEntity["id"],
  name: UsersEntity["name"],
  email: UsersEntity["email"]
  role: UsersEntity["role"]
  investorProfileName?: UsersEntity["investorProfileName"]
}
interface userCreated {
  id: UsersEntity["id"],
  name: UsersEntity["name"],
  email: UsersEntity["email"]
  username: UsersEntity["username"]
}

interface validationResponse {
  isValid: boolean;
  statusCode: number;
  isEmpty?: boolean;
  errorMessage?: string | string[] | Prisma.PrismaClientKnownRequestError;
  successMessage?: string;

  token?: string
  refreshToken?: unknown;

  totalDocuments?: number

  users?: {
    id: UsersEntity["id"]
    name: UsersEntity["name"]
    email: UsersEntity["email"]
    username: UsersEntity["username"]
  }

  usersList?: UsersEntity[]
  usersResumed?: {
    id: UsersEntity["id"],
    name: UsersEntity["name"],
    email: UsersEntity["email"]
    role: UsersEntity["role"]
  }

  usersResumedList?: {
    id: UsersEntity["id"],
    name: UsersEntity["name"],
    email: UsersEntity["email"]
    role: UsersEntity["role"]
  }[]

  userInvestment?: UserInvestmentEntity
  userInvestmentList?: UserInvestmentEntity[]

  userProprietario?: UserProprietarioEntity
  userProprietarioList?: UserProprietarioEntity[]

  investment?: InvestmentEntity,
  investmentList?: InvestmentEntity[]
}


export {
  validationResponse,
  usersResumed,
  userCreated
}