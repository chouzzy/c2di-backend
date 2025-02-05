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
  totalUnits: yup.string(), // Número inteiro positivo
  numberOfFloors: yup.string(), // Número inteiro positivo
  unitsPerFloor: yup.string(), // Número inteiro positivo
  floorPlanTypes: yup.array().of(yup.string()).min(1),
  launchDate: yup.string(),
  constructionStartDate: yup.string(),
  expectedDeliveryDate: yup.string(),
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
        url: yup.string(),
      }),
    ),
  images: yup
    .array()
    .of(
      yup.object().shape({
        url: yup.string(),
        description: yup.string(), // Removido o optional()
      }),
    ),
  investmentValue: yup.string(), // Número positivo
  companyName: yup.string(),

  partners: yup.array().of(
    yup.object().shape({
      id: yup.string().required("A ID é obrigatório."),
      url: yup.string().required("O link do parceiro é obrigatório"),
      name: yup.string().required('O nome do parceiro é obrigatório'),
      activity: yup.string().required("O segmento de atuação do parceiro é obrigatório"),
    })
  ).nullable(),

  finishDate: yup.string().nullable(),
  buildingStatus: yup.string(),
  investmentDate: yup.string(),
  predictedCost: yup.object().shape({
    foundation: yup.number(),
    structure: yup.number(),
    implantation: yup.number(),
    workmanship: yup.number(),
  }),
  realizedCost: yup.object().shape({
    foundation: yup.number(),
    structure: yup.number(),
    implantation: yup.number(),
    workmanship: yup.number(),
  }),
  active: yup.boolean().nullable(),
  buildingProgress: yup.object().shape({
    acabamento: yup.number().required("O acabamento é obrigatório"),
    alvenaria: yup.number().required("O alvenaria é obrigatório"),
    estrutura: yup.number().required("O estrutura é obrigatório"),
    fundacao: yup.number().required("O fundacao é obrigatório"),
    instalacoes: yup.number().required("O instalacoes é obrigatório"),
    pintura: yup.number().required("O pintura é obrigatório"),
  }).nullable(),

  apartamentTypes: yup.array().of(yup.object().shape({
    id: yup.string().required('ID é obrigatório'),
    metragem: yup.string().required('Metragem é obrigatória'),
    description: yup.string().required('Descrição é obrigatória'),
    fotos: yup.array().of(yup.string().url('URL da foto inválida')), // Valida se cada elemento do array é uma URL válida
    plantas: yup.array().of(yup.string().url('URL da planta inválida')), // Valida se cada elemento do array é uma URL válida
  })),

  apartaments: yup.array().of(yup.object().shape({
    id: yup.string().required('ID é obrigatório'),
    andar: yup.string().required('Andar é obrigatório'),
    final: yup.string().required('Final é obrigatório'),
    metragem: yup.string().required('Metragem é obrigatória'),
    userId: yup.string().nullable(),
    tipoId: yup.string().required('Tipo de apartamento é obrigatório'),
  })),
  valorMetroQuadrado: yup.array().of(yup.object().shape({
    id: yup.string().required('ID é obrigatório'),
    valor: yup.string().required('O valor é obrigatório'),
  })),
}).noUnknown(true, "Campos desconhecidos no corpo da requisição.").strict();

export { updateInvestmentSchema };