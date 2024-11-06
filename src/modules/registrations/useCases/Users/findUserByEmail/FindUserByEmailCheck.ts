import { ValidationError } from "yup";
import { validationResponse } from "../../../../../types";
import { UsersEntity } from "../../../entities/Users";
import { FilterUsersRequestProps } from "./FindUserByEmailController";
import { findUserByEmailSchema } from "./FindUserByEmailSchema";


async function checkQuery(usersQuery: FilterUsersRequestProps) {

    try {
        await findUserByEmailSchema.validate(usersQuery, {
            abortEarly: false
        })

        return
    } catch (error) {
        throw error
    }

}


export { checkQuery }