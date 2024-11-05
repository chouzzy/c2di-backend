import * as yup from "yup";
import YupPassword from 'yup-password';
YupPassword(yup); // Isso adiciona os métodos de validação de senha ao yup

const createUsersSchema = yup.object({
  name: yup.string().required("O nome é obrigatório").min(2, "O nome precisa ter no mínimo dois caracteres"),
  email: yup.string().email("Formato de email inválido").required("O e-mail é obrigatório").min(3, "O email precisa ter no mínimo três caracteres"),
  phoneNumber: yup.string().required("O número de telefone é obrigatório"), 
  gender: yup.string().required("O gênero é obrigatório"),
  profession: yup.string().required("A profissão é obrigatória"),

  birth: yup.string().required("A data de nascimento é obrigatória").typeError("A data de nascimento deve ser uma data válida no formato YYYY-MM-DD"),
  cpf: yup.string().required("O CPF é obrigatório").min(11, "CPF inválido").max(11, "CPF inválido."),

  username: yup.string().required("O username é obrigatório").min(3, "O username precisa conter no mínimo 3 caracteres"),

  address: yup.object().shape({
    street: yup.string().required("A rua é obrigatória"),
    number: yup.string().required("O número é obrigatório"),
    complement: yup.string().optional(),
    district: yup.string().required("O bairro é obrigatório"),
    city: yup.string().required("A cidade é obrigatória"),
    state: yup.string().required("O estado é obrigatório"),
    zipCode: yup.string().required("O CEP é obrigatório"),
  }).nullable(), // Permite que o endereço seja nulo

  investorProfileName: yup.string().optional(),
  investorProfileDescription: yup.string().optional(),
  
  role: yup.mixed().oneOf(["INVESTOR", "PROJECT_MANAGER", "ADMINISTRATOR"]).required("A role é obrigatória")
}).noUnknown(true, "Campos desconhecidos no corpo da requisição.").strict();

export { createUsersSchema };