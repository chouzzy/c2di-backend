import * as yup from "yup";

const photoSchema = yup.object().shape({
  id: yup.string().required().uuid(),
  url: yup.string().required().url(),
  title: yup.string().optional(), // title é opcional
  description: yup.string().optional(), // description é opcional
});

const createInvestmentSchema = yup.object({

  title: yup.string().required("O título do investimento é obrigatório."),
  description: yup.string().required("A descrição do investimento é obrigatória."),
  projectType: yup
    .mixed()
    .oneOf(["RESIDENCIAL_MULTIFAMILIAR", "RESIDENCIAL_VERTICAL", "COMERCIAL_GERAL", "MISTO"])
    .required("O tipo do projeto é obrigatório."),
  totalUnits: yup.string().required("O total de unidades é obrigatório."),
  numberOfFloors: yup.string().required("O número de pavimentos é obrigatório."),
  unitsPerFloor: yup.string().required("O número de unidades por pavimento é obrigatório."),
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

  partners: yup.array().of(
    yup.object().shape({
      id: yup.string().required("A ID é obrigatório."),
      url: yup.string().required("O link do parceiro é obrigatório"),
      name: yup.string().required('O nome do parceiro é obrigatório'),
      activity: yup.string().required("O segmento de atuação do parceiro é obrigatório"),
    })
  ).nullable(),

  documents: yup
    .array()
    .of(
      yup.object().shape({
        title: yup.string(),
        url: yup.string()
      }),
    ),
  images: yup
    .array()
    .of(
      yup.object().shape({
        label: yup.string().oneOf(["DESTAQUES", "GERAL", "PLANTAS", "EXTERNO", "INTERNO", "PANORAMICAS"]).required('Label obrigatória'),
        url: yup.string().required("A URL da imagem é obrigatória."),
        description: yup.string().optional(),
      }),
    )
    .required("As imagens são obrigatórias."),

  photos: yup.object().shape({
    category: yup.string().required(),
    images: yup.array().of(photoSchema).required().min(1),
  }).required("As imagens são obrigatórias."),

  companyName: yup.string().required("O nome da empresa é obrigatório."),
  finishDate: yup.string().nullable(), // A data de término pode ser nula
  buildingStatus: yup.string().oneOf(["LANCAMENTO", "CONSTRUCAO", "FINALIZACAO", "FINALIZADO"]).required("O status da construção é obrigatório."),
  investmentDate: yup.string(),
  predictedCost: yup.object().shape({
    foundation: yup.number().required("O custo previsto da fundação é obrigatório."),
    structure: yup.number().required("O custo previsto da estrutura é obrigatório."),
    implantation: yup.number().required("O custo previsto da implantação é obrigatório."),
    workmanship: yup.number().required("O custo previsto da mão de obra é obrigatório."),
  }).required("O custo previsto é obrigatório"),
  realizedCost: yup.object().shape({
    foundation: yup.number().required("O custo realizado da fundação é obrigatório."),
    structure: yup.number().required("O custo realizado da estrutura é obrigatório."),
    implantation: yup.number().required("O custo realizado da implantação é obrigatório."),
    workmanship: yup.number().required("O custo realizado da mão de obra é obrigatório."),
  }).nullable(),
  projectManagerID: yup.string().required("O ID do Gerente de projeto é obrigatório"),
  constructionCompany: yup.string().required("O nome da construtora é obrigatório")

}).noUnknown(true, "Campos desconhecidos no corpo da requisição.").strict();

export { createInvestmentSchema };