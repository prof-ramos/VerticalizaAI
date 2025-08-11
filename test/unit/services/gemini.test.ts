// 🧪 Testes unitários para o serviço Gemini

import { describe, it, expect, beforeEach } from 'vitest';
import { processEditalWithGemini } from '@server/services/gemini';
import { 
  setMockGeminiResponse, 
  setMockGeminiError, 
  resetGeminiMock,
  getLastGeminiPrompt 
} from '@test/setup/mocks/gemini-mock';

describe('Gemini Service', () => {
  beforeEach(() => {
    resetGeminiMock();
  });

  describe('processEditalWithGemini', () => {
    it('should process edital text and return structured content', async () => {
      // Arrange
      const editalText = `
        TRIBUNAL DE CONTAS DA UNIÃO
        EDITAL Nº 1/2021
        
        CONHECIMENTOS BÁSICOS:
        LÍNGUA PORTUGUESA:
        1. Compreensão e interpretação de textos
        2. Tipologia textual
        
        RACIOCÍNIO LÓGICO:
        1. Estruturas lógicas
      `;

      const expectedResponse = {
        disciplinas: [
          {
            nome: "LÍNGUA PORTUGUESA",
            topicos: [
              "1. Compreensão e interpretação de textos",
              "2. Tipologia textual"
            ]
          },
          {
            nome: "RACIOCÍNIO LÓGICO", 
            topicos: [
              "1. Estruturas lógicas"
            ]
          }
        ]
      };

      setMockGeminiResponse(expectedResponse);

      // Act
      const result = await processEditalWithGemini(editalText);

      // Assert
      expect(result).toEqual(expectedResponse);
      expect(result.disciplinas).toHaveLength(2);
      expect(result.disciplinas[0].nome).toBe("LÍNGUA PORTUGUESA");
      expect(result.disciplinas[0].topicos).toHaveLength(2);
    });

    it('should handle text with multiple knowledge areas', async () => {
      // Arrange
      const complexEditalText = `
        CONHECIMENTOS BÁSICOS (P1):
        LÍNGUA PORTUGUESA: 1. Gramática, 2. Interpretação
        MATEMÁTICA: 1. Álgebra, 2. Geometria
        
        CONHECIMENTOS ESPECÍFICOS (P2):
        DIREITO CONSTITUCIONAL: 1. Princípios fundamentais
        DIREITO ADMINISTRATIVO: 1. Poderes da administração
      `;

      const expectedResponse = {
        disciplinas: [
          {
            nome: "LÍNGUA PORTUGUESA",
            topicos: ["1. Gramática", "2. Interpretação"]
          },
          {
            nome: "MATEMÁTICA",
            topicos: ["1. Álgebra", "2. Geometria"]
          },
          {
            nome: "DIREITO CONSTITUCIONAL",
            topicos: ["1. Princípios fundamentais"]
          },
          {
            nome: "DIREITO ADMINISTRATIVO",
            topicos: ["1. Poderes da administração"]
          }
        ]
      };

      setMockGeminiResponse(expectedResponse);

      // Act
      const result = await processEditalWithGemini(complexEditalText);

      // Assert
      expect(result.disciplinas).toHaveLength(4);
      expect(result.disciplinas.map(d => d.nome)).toContain("DIREITO CONSTITUCIONAL");
      expect(result.disciplinas.map(d => d.nome)).toContain("DIREITO ADMINISTRATIVO");
    });

    it('should throw error when Gemini API fails', async () => {
      // Arrange
      const editalText = "Some edital content";
      const apiError = new Error('Gemini API rate limit exceeded');
      setMockGeminiError(apiError);

      // Act & Assert
      await expect(processEditalWithGemini(editalText))
        .rejects.toThrow('Gemini API rate limit exceeded');
    });

    it('should throw error when GEMINI_API_KEY is missing', async () => {
      // Arrange
      const originalKey = process.env.GEMINI_API_KEY;
      delete process.env.GEMINI_API_KEY;
      
      try {
        // Act & Assert
        await expect(processEditalWithGemini("test"))
          .rejects.toThrow('GEMINI_API_KEY not found in environment variables');
      } finally {
        // Cleanup
        process.env.GEMINI_API_KEY = originalKey;
      }
    });

    it('should limit text size to 50000 characters', async () => {
      // Arrange
      const longText = 'A'.repeat(100000); // 100k characters
      const expectedResponse = { disciplinas: [] };
      setMockGeminiResponse(expectedResponse);

      // Act
      await processEditalWithGemini(longText);

      // Assert
      const lastPrompt = getLastGeminiPrompt();
      expect(lastPrompt.length).toBeLessThan(60000); // Prompt + template should be < 60k
    });

    it('should handle invalid JSON response from Gemini', async () => {
      // Arrange
      const editalText = "Valid edital content";
      // Mock Gemini to return invalid JSON
      setMockGeminiResponse("invalid json response");

      // Act & Assert
      await expect(processEditalWithGemini(editalText))
        .rejects.toThrow();
    });

    it('should extract JSON from wrapped response', async () => {
      // Arrange
      const editalText = "Edital content";
      const validContent = {
        disciplinas: [
          { nome: "PORTUGUÊS", topicos: ["1. Gramática"] }
        ]
      };

      // Mock response wrapped in markdown
      const wrappedResponse = `Here is the analysis:\n\`\`\`json\n${JSON.stringify(validContent)}\n\`\`\`\nEnd of analysis.`;
      setMockGeminiResponse(wrappedResponse);

      // Act
      const result = await processEditalWithGemini(editalText);

      // Assert
      expect(result).toEqual(validContent);
      expect(result.disciplinas[0].nome).toBe("PORTUGUÊS");
    });
  });
});