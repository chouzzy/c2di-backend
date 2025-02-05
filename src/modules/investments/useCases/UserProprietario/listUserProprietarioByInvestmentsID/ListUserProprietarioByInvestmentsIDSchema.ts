import { object, string } from "yup";

const listUserProprietarioByInvestmentsIDSchema = object({

    investmentID: string(),

    page: string(),
    pageRange: string()
})

export {listUserProprietarioByInvestmentsIDSchema}