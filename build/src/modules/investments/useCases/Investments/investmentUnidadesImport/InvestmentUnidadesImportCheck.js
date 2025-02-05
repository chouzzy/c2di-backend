"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkWorksheet = void 0;
class PlanilhaInvalidaError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PlanilhaInvalidaError';
    }
}
function checkWorksheet(worksheet) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // ... (outras validações)
            // 1. Validar a primeira célula (deve ser string)
            const primeiraCelula = worksheet.getCell('A1').value;
            if (typeof primeiraCelula !== 'string') {
                throw new PlanilhaInvalidaError(`Valor inválido na célula A1. Esperado string, encontrado ${typeof primeiraCelula}.`);
            }
            // 2. Validar a primeira coluna (deve conter apenas números)
            for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
                const row = worksheet.getRow(rowNumber);
                const valorColuna1 = row.getCell(1).value;
                if (typeof valorColuna1 !== 'number' || isNaN(valorColuna1)) {
                    throw new PlanilhaInvalidaError(`Valor inválido na linha ${rowNumber}, coluna 1. Esperado número, encontrado ${typeof valorColuna1}.`);
                }
                // ... (outras validações)
            }
            return;
        }
        catch (error) {
            // ... (tratamento de erros)
        }
    });
}
exports.checkWorksheet = checkWorksheet;
