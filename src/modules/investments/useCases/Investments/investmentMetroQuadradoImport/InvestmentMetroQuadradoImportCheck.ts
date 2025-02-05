import { Worksheet } from 'exceljs';

class PlanilhaInvalidaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PlanilhaInvalidaError';
  }
}


async function checkWorksheet(worksheet: Worksheet): Promise<void> {
  try {
    // Verifica se a planilha tem pelo menos uma linha (cabeçalho)
    if (worksheet.rowCount < 1) {
      throw new Error('A planilha está vazia.');
    }

    // Verifica se a planilha tem duas colunas
    const headerRow = worksheet.getRow(1);
    if (headerRow.cellCount !== 2) {
      throw new Error('A planilha deve ter exatamente duas colunas: "Valor" e "Data".');
    }

    // Verifica os nomes das colunas
    if (headerRow.getCell(1).text !== 'Valor' || headerRow.getCell(2).text !== 'Data') {
      throw new Error('Os cabeçalhos das colunas devem ser "Valor" e "Data".');
    }

    // Validação dos valores das células
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Ignora o cabeçalho

      const valorCell = row.getCell(1);
      const dataCell = row.getCell(2);

      // Validar o valor
      if (!valorCell || !valorCell.text) {
        throw new Error(`Valor ausente na linha ${rowNumber}.`);
      }

      const valor = parseFloat(valorCell.text.replace('R$ ', '').replace('.', '').replace(',', '.'));

      if (isNaN(valor)) {
        throw new Error(`Valor inválido na linha ${rowNumber}: ${valorCell.text}`);
      }

      // Validar a data
      if (!dataCell || !dataCell.text) {
        throw new Error(`Data ausente na linha ${rowNumber}.`);
      }

      const data = new Date(dataCell.text);
      if (!isValidDate(data)) {
        throw new Error(`Data inválida na linha ${rowNumber}: ${dataCell.text}`);
      }
    });
  } catch (error) {
    console.error('Erro na verificação da planilha:', error);
    throw error; // Propaga o erro para ser tratado pelo controller
  }
}

// Função auxiliar para validar a data
function isValidDate(date: Date): boolean {
  return date instanceof Date && !isNaN(date.getTime());
}

export { checkWorksheet };