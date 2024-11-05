import * as yup from "yup";

const createInvestmentSchema = yup.object({

  title: yup.string().required("O título do investimento é obrigatório."),
  description: yup.string().required("A descrição do investimento é obrigatória."),
  projectType: yup
    .mixed()
    .oneOf(["RESIDENCIAL_MULTIFAMILIAR", "RESIDENCIAL_VERTICAL", "COMERCIAL_GERAL", "MISTO"])
    .required("O tipo do projeto é obrigatório."),
  totalUnits: yup.number().integer().required("O total de unidades é obrigatório."),
  numberOfFloors: yup.number().integer().required("O número de pavimentos é obrigatório."),
  unitsPerFloor: yup.number().integer().required("O número de unidades por pavimento é obrigatório."),
  floorPlanTypes: yup.array().of(yup.string()).min(1, "Deve haver pelo menos uma tipologia de planta").required("As tipologias das plantas são obrigatórias."),
  launchDate: yup.string().required("A data de lançamento é obrigatória."),
  constructionStartDate: yup.string().required("A data de início da obra é obrigatória."),
  expectedDeliveryDate: yup.string().required("A data de previsão de entrega é obrigatória."),
  address: yup.object().shape({
    street: yup.string().required("A rua é obrigatória."),
    number: yup.string().required("O número é obrigatório."),
    complement: yup.string().optional(),
    district: yup.string().required("O bairro é obrigatório."),
    city: yup.string().required("A cidade é obrigatória."),
    state: yup.string().required("O estado é obrigatório."),
    zipCode: yup.string().required("O CEP é obrigatório."),
  }).required("O endereço do empreendimento é obrigatório"),
  documents: yup
    .array()
    .of(
      yup.object().shape({
        title: yup.string(),
        url: yup.string().url()
      }),
    ),
  images: yup
    .array()
    .of(
      yup.object().shape({
        url: yup.string().url().required("A URL da imagem é obrigatória."),
        description: yup.string().optional(),
      }),
    )
    .required("As imagens são obrigatórias."),
  investmentValue: yup.number().required("O valor do investimento é obrigatório."),
  companyName: yup.string().required("O nome da empresa é obrigatório."),
  partners: yup.array().of(yup.string()).required("Os nomes dos principais parceiros são obrigatórios."),
  finishDate: yup.string().nullable(), // A data de término pode ser nula
  buildingStatus: yup.string().required("O status da construção é obrigatório."),
  investmentDate: yup.string().required("A data do investimento é obrigatória."),
  predictedCost: yup.object().shape({
    foundation: yup.string().required("O custo previsto da fundação é obrigatório."),
    structure: yup.string().required("O custo previsto da estrutura é obrigatório."),
    implantation: yup.string().required("O custo previsto da implantação é obrigatório."),
    workmanship: yup.string().required("O custo previsto da mão de obra é obrigatório."),
  }).required("O custo previsto é obrigatório"),
  realizedCost: yup.object().shape({
    foundation: yup.string().required("O custo realizado da fundação é obrigatório."),
    structure: yup.string().required("O custo realizado da estrutura é obrigatório."),
    implantation: yup.string().required("O custo realizado da implantação é obrigatório."),
    workmanship: yup.string().required("O custo realizado da mão de obra é obrigatório."),
  }).required("O custo realizado é obrigatório"),

}).noUnknown(true, "Campos desconhecidos no corpo da requisição.").strict();

export { createInvestmentSchema };