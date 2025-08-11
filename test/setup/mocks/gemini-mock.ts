// 🤖 Mock da API do Google Gemini para testes

import { vi } from 'vitest';

// Mock da resposta padrão do Gemini
const mockGeminiResponse = {
  disciplinas: [
    {
      nome: "LÍNGUA PORTUGUESA",
      topicos: [
        "1. Compreensão e interpretação de textos",
        "2. Tipologia textual",
        "3. Ortografia oficial",
        "4. Acentuação gráfica",
        "5. Emprego das classes de palavras"
      ]
    },
    {
      nome: "RACIOCÍNIO LÓGICO",
      topicos: [
        "1. Estruturas lógicas",
        "2. Lógica de argumentação",
        "3. Diagramas lógicos",
        "4. Sequências"
      ]
    }
  ]
};

// Mock da classe GoogleGenerativeAI
const mockGenerativeAI = {
  getGenerativeModel: vi.fn(() => ({
    generateContent: vi.fn().mockResolvedValue({
      response: {
        text: vi.fn(() => JSON.stringify(mockGeminiResponse))
      }
    })
  }))
};

// Mock do módulo @google/generative-ai
vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn(() => mockGenerativeAI)
}));

// Helper para customizar resposta do Gemini em testes específicos
export function setMockGeminiResponse(response: any) {
  mockGenerativeAI.getGenerativeModel.mockReturnValue({
    generateContent: vi.fn().mockResolvedValue({
      response: {
        text: vi.fn(() => JSON.stringify(response))
      }
    })
  });
}

// Helper para simular erro na API do Gemini
export function setMockGeminiError(error: Error) {
  mockGenerativeAI.getGenerativeModel.mockReturnValue({
    generateContent: vi.fn().mockRejectedValue(error)
  });
}

// Helper para verificar se o Gemini foi chamado
export function getGeminiCallCount() {
  const model = mockGenerativeAI.getGenerativeModel();
  return model.generateContent.mock.calls.length;
}

// Helper para obter o último prompt enviado
export function getLastGeminiPrompt() {
  const model = mockGenerativeAI.getGenerativeModel();
  const calls = model.generateContent.mock.calls;
  return calls[calls.length - 1]?.[0];
}

// Reset do mock entre testes
export function resetGeminiMock() {
  vi.clearAllMocks();
  setMockGeminiResponse(mockGeminiResponse);
}

// Configuração inicial
setMockGeminiResponse(mockGeminiResponse);