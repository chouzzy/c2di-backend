import { deleteUserProprietariosSchema } from "./DeleteUserProprietarioSchema"

async function checkBody(id: any){
    // check body properties
    try {

        await deleteUserProprietariosSchema.validate({id}, {
            abortEarly: false,
        })

        if (!id) {
            throw Error("ID do usuário inválido.")
        }

        return
    }
    catch (error) {
        throw error
    }
}

export { checkBody }



