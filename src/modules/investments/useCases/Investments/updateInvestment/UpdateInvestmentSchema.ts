import * as yup from "yup";

const updateInvestmentSchema = yup.object({
  title: yup.string(),
  description: yup.string(),
  projectType: yup
    .mixed()
    .oneOf([
      "RESIDENCIAL_MULTIFAMILIAR",
      "RESIDENCIAL_VERTICAL",
      "COMERCIAL_GERAL",
      "MISTO",
    ]),
  totalUnits: yup.number().integer().positive(), // Número inteiro positivo
  numberOfFloors: yup.number().integer().positive(), // Número inteiro positivo
  unitsPerFloor: yup.number().integer().positive(), // Número inteiro positivo
  floorPlanTypes: yup.array().of(yup.string()).min(1),
  launchDate: yup.date(),
  constructionStartDate: yup.date(),
  expectedDeliveryDate: yup.date(),
  address: yup.object().shape({
    street: yup.string(),
    number: yup.string(),
    complement: yup.string(), // Removido o optional()
    district: yup.string(),
    city: yup.string(),
    state: yup.string(),
    zipCode: yup.string(),
  }),
  documents: yup
    .array()
    .of(
      yup.object().shape({
        title: yup.string(),
        url: yup.string().url(),
      }),
    ),
  images: yup
    .array()
    .of(
      yup.object().shape({
        url: yup.string().url(),
        description: yup.string(), // Removido o optional()
      }),
    ),
  investmentValue: yup.number().positive(), // Número positivo
  companyName: yup.string(),
  partners: yup.array().of(yup.string()),
  finishDate: yup.date().nullable(),
  buildingStatus: yup.string(),
  investmentDate: yup.date(),
  predictedCost: yup.object().shape({
    foundation: yup.string(),
    structure: yup.string(),
    implantation: yup.string(),
    workmanship: yup.string(),
  }),
  realizedCost: yup.object().shape({
    foundation: yup.string(),
    structure: yup.string(),
    implantation: yup.string(),
    workmanship: yup.string(),
  }),
}).noUnknown(true, "Campos desconhecidos no corpo da requisição.").strict();

export { updateInvestmentSchema };