import * as yup from "yup";

const photoSchema = yup.object().shape({
  id: yup.string().required().uuid(),
  url: yup.string().required(),
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
    ),

  photos: yup.array()
    .of(
      yup.object().shape({
        category: yup.string().required(),
        images: yup.array().of(photoSchema),
      })
    ),

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

  constructionCompany: yup.string().required("O nome da construtora é obrigatório"),

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
      tags: yup.array().of(yup.string().trim().min(1, "Tag inválida")).optional(), // Array de strings, opcional. Cada tag deve ter pelo menos 1 caractere (após trim)
    })),

  alvaras: yup.object().shape({
    demolicao: yup.object().shape({
      title: yup.string().required('O título do alvará é obrigatório').trim().min(2, 'O título deve ter pelo menos 2 caracteres.'),
      link: yup.string().url('Link inválido.').optional().nullable(),
      numero: yup.string().optional().nullable(),
      observacoes: yup.string().optional().nullable(),
      dataEmissao: yup.string().optional().nullable(),
      dataValidade: yup.string().optional().nullable()
    }).optional().nullable(),
    aprovacao: yup.object().shape({
      title: yup.string().required('O título do alvará é obrigatório').trim().min(2, 'O título deve ter pelo menos 2 caracteres.'),
      link: yup.string().url('Link inválido.').optional().nullable(),
      numero: yup.string().optional().nullable(),
      observacoes: yup.string().optional().nullable(),
      dataEmissao: yup.string().optional().nullable(),
      dataValidade: yup.string().optional().nullable()
    }).optional().nullable(),
    construcao: yup.object().shape({
      title: yup.string().required('O título do alvará é obrigatório').trim().min(2, 'O título deve ter pelo menos 2 caracteres.'),
      link: yup.string().url('Link inválido.').optional().nullable(),
      numero: yup.string().optional().nullable(),
      observacoes: yup.string().optional().nullable(),
      dataEmissao: yup.string().optional().nullable(),
      dataValidade: yup.string().optional().nullable()
    }).optional().nullable(),
    estande: yup.object().shape({
      title: yup.string().required('O título do alvará é obrigatório').trim().min(2, 'O título deve ter pelo menos 2 caracteres.'),
      link: yup.string().url('Link inválido.').optional().nullable(),
      numero: yup.string().optional().nullable(),
      observacoes: yup.string().optional().nullable(),
      dataEmissao: yup.string().optional().nullable(),
      dataValidade: yup.string().optional().nullable()
    }).optional().nullable(),
  })

}).noUnknown(true, "Campos desconhecidos no corpo da requisição.").strict();

export { createInvestmentSchema };