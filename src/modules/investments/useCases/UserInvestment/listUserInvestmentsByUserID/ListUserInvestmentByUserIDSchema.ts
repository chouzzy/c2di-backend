import { object, string } from "yup";

const listUserInvestmentByUserIDSchema = object({

    userID: string(),

    page: string(),
    pageRange: string()
})

export {listUserInvestmentByUserIDSchema}