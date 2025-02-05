import { object, string } from "yup";

const listUserProprietarioSchema = object({

    userID: string(),
    investmentID: string(),

    page: string(),
    pageRange: string()
})

export {listUserProprietarioSchema}