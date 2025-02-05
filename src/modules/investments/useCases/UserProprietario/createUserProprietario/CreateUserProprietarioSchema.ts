import * as yup from "yup" ;
import YupPassword from 'yup-password'
YupPassword(yup)

const createUserProprietarioSchema = yup.object({

    userID: yup.string().required("O userID é obrigatório"),
    investmentID: yup.string().required("O investmentID é obrigatório"),
    investedValue: yup.number().required("O valor investido é obrigatório"),
    apartamentID:yup.string().required("O apartamento é obrigatório")
})

export { createUserProprietarioSchema }