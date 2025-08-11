// 📄 Mock da biblioteca pdf-parse para testes

import { vi } from 'vitest';

// Texto mock de um edital típico
const mockPdfText = `
TRIBUNAL DE CONTAS DA UNIÃO
EDITAL DE CONCURSO PÚBLICO Nº 1/2021

ANEXO I - CONTEÚDO PROGRAMÁTICO

CONHECIMENTOS BÁSICOS (P1)

LÍNGUA PORTUGUESA:
1. Compreensão e interpretação de textos de gêneros variados.
2. Reconhecimento de tipos e gêneros textuais.
3. Domínio da ortografia oficial.
4. Domínio dos mecanismos de coesão textual.
5. Emprego de elementos de referenciação, substituição e repetição, de conectores e de outros elementos de sequenciação textual.

RACIOCÍNIO LÓGICO:
1. Estruturas lógicas.
2. Lógica de argumentação: analogias, inferências, deduções e conclusões.
3. Lógica sentencial (ou proposicional).
4. Proposições simples e compostas.
5. Tabelas-verdade.

CONHECIMENTOS ESPECÍFICOS (P2)

DIREITO CONSTITUCIONAL:
1. Constituição da República Federativa do Brasil de 1988.
2. Princípios fundamentais.
3. Aplicabilidade das normas constitucionais.
4. Direitos e garantias fundamentais.

DIREITO ADMINISTRATIVO:
1. Estado, governo e administração pública.
2. Direito administrativo.
3. Princípios do direito administrativo.
4. Poderes da administração pública.
`;

// Mock da função pdf-parse
const mockPdfParse = vi.fn().mockImplementation((buffer: Buffer) => {
  // Simular diferentes tipos de PDFs baseado no tamanho do buffer
  if (buffer.length === 0) {
    throw new Error('Invalid PDF buffer');
  }
  
  if (buffer.length < 100) {
    // PDF muito pequeno - simular erro
    throw new Error('PDF appears to be corrupted');
  }
  
  // Simular extração bem-sucedida
  return Promise.resolve({
    text: mockPdfText,
    numpages: 5,
    numrender: 5,
    info: {
      PDFFormatVersion: '1.4',
      IsAcroFormPresent: false,
      IsXFAPresent: false,
      Title: 'Edital TCU 2021',
      Creator: 'Mock PDF Creator'
    },
    metadata: null,
    version: '1.10.100'
  });
});

// Mock do módulo pdf-parse
vi.mock('pdf-parse', () => ({
  default: mockPdfParse
}));

// Helper para customizar o texto extraído do PDF
export function setMockPdfText(text: string) {
  mockPdfParse.mockImplementation(() => 
    Promise.resolve({
      text,
      numpages: Math.ceil(text.length / 2000),
      numrender: Math.ceil(text.length / 2000),
      info: {
        PDFFormatVersion: '1.4',
        IsAcroFormPresent: false,
        IsXFAPresent: false,
        Title: 'Mock PDF Document',
        Creator: 'Mock PDF Creator'
      },
      metadata: null,
      version: '1.10.100'
    })
  );
}

// Helper para simular erro na extração de PDF
export function setMockPdfError(error: Error) {
  mockPdfParse.mockRejectedValue(error);
}

// Helper para verificar quantas vezes o PDF foi processado
export function getPdfCallCount() {
  return mockPdfParse.mock.calls.length;
}

// Helper para obter o último buffer processado
export function getLastPdfBuffer() {
  const calls = mockPdfParse.mock.calls;
  return calls[calls.length - 1]?.[0];
}

// Reset do mock entre testes
export function resetPdfMock() {
  vi.clearAllMocks();
  setMockPdfText(mockPdfText);
}

// Configuração inicial
setMockPdfText(mockPdfText);

export { mockPdfText };