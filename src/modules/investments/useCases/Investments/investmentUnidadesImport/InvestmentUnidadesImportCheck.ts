import { Worksheet } from 'exceljs';

class PlanilhaInvalidaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PlanilhaInvalidaError';
  }
}

async function checkWorksheet(worksheet: Worksheet): Promise<void> {
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
  } catch (error) {
    // ... (tratamento de erros)
  }
}

export { checkWorksheet };