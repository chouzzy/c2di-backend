import * as yup from "yup";

const photoSchema = yup.object().shape({
  id: yup.string().required().uuid(),
  url: yup.string().required(),
  title: yup.string().optional(), // title é opcional
  description: yup.string().optional(), // description é opcional
});


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

  photos: yup.array()
    .of(
      yup.object().shape({
        category: yup.string().required(),
        images: yup.array().of(photoSchema),
      })
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
  buildingStatus: yup.string().oneOf(["LANCAMENTO", "CONSTRUCAO", "FINALIZACAO", "FINALIZADO"]),
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
  constructionCompany: yup.string(),

  tipologies: yup.array()
    .of(yup.object().shape({
      name: yup.string().required("O nome da tipologia é obrigatório.").trim().min(3, "O nome deve ter pelo menos 3 caracteres."), // String, obrigatório, mínimo de 3 caracteres
      image: yup.string().required("A URL da imagem da planta é obrigatória.").url("A URL da imagem não é válida."), // String, obrigatório, URL válida.
      description: yup.string().optional(), // String, opcional.  Se precisar, adicione regras como .min() ou .max()
      rooms: yup.number().optional().integer("O número de quartos deve ser um número inteiro.").min(0, "O número de quartos não pode ser negativo."), // Number, opcional, inteiro, não negativo
      suits: yup.number().optional().integer("O número de suítes deve ser um número inteiro.").min(0, "O número de suítes não pode ser negativo."), // Number, opcional, inteiro, não negativo
      bathrooms: yup.number().optional().integer("O número de banheiros deve ser um número inteiro.").min(0, "O número de banheiros não pode ser negativo."), // Number, opcional, inteiro, não negativo
      parkingSpaces: yup.number().optional().integer("O número de vagas deve ser um número inteiro.").min(0, "O número de vagas não pode ser negativo."),// Number, opcional, inteiro, não negativo
      area: yup.number().optional(),    // String, opcional.  Se precisar validar como número, mude para yup.number() e adicione as validações.
      tags: yup.array().of(yup.string().trim()).optional(), // Array de strings, opcional. Cada tag deve ter pelo menos 1 caractere (após trim)
    }))

}).noUnknown(true, "Campos desconhecidos no corpo da requisição.").strict();

export { updateInvestmentSchema };