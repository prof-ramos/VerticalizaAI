// 🧪 Testes unitários para o serviço de PDF

import { describe, it, expect, beforeEach } from 'vitest';
import { extractTextFromPDF } from '@server/services/pdf';
import { setMockPdfText, setMockPdfError, resetPdfMock } from '@test/setup/mocks/pdf-mock';

describe('PDF Service', () => {
  beforeEach(() => {
    resetPdfMock();
  });

  describe('extractTextFromPDF', () => {
    it('should extract text from valid PDF buffer', async () => {
      // Arrange
      const mockBuffer = Buffer.from('valid pdf content');
      const expectedText = 'LÍNGUA PORTUGUESA:\n1. Compreensão de textos';
      setMockPdfText(expectedText);

      // Act
      const result = await extractTextFromPDF(mockBuffer);

      // Assert
      expect(result).toBe(expectedText);
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should extract edital content with proper structure', async () => {
      // Arrange
      const mockBuffer = Buffer.from('edital content');
      const editalText = `
        TRIBUNAL DE CONTAS DA UNIÃO
        EDITAL Nº 1/2021
        
        CONHECIMENTOS BÁSICOS:
        LÍNGUA PORTUGUESA:
        1. Compreensão e interpretação de textos
        2. Tipologia textual
        
        RACIOCÍNIO LÓGICO:
        1. Estruturas lógicas
        2. Lógica de argumentação
      `;
      setMockPdfText(editalText);

      // Act
      const result = await extractTextFromPDF(mockBuffer);

      // Assert
      expect(result).toContain('LÍNGUA PORTUGUESA');
      expect(result).toContain('RACIOCÍNIO LÓGICO');
      expect(result).toContain('1. Compreensão e interpretação');
      expect(result).toContain('1. Estruturas lógicas');
    });

    it('should throw error for invalid PDF buffer', async () => {
      // Arrange
      const invalidBuffer = Buffer.from('');
      setMockPdfError(new Error('Invalid PDF buffer'));

      // Act & Assert
      await expect(extractTextFromPDF(invalidBuffer))
        .rejects.toThrow('Failed to extract text from PDF');
    });

    it('should throw error for corrupted PDF', async () => {
      // Arrange
      const corruptedBuffer = Buffer.from('corrupted data');
      setMockPdfError(new Error('PDF appears to be corrupted'));

      // Act & Assert
      await expect(extractTextFromPDF(corruptedBuffer))
        .rejects.toThrow('Failed to extract text from PDF');
    });

    it('should handle large PDF files', async () => {
      // Arrange
      const largeBuffer = Buffer.alloc(5 * 1024 * 1024); // 5MB
      const largeText = 'A'.repeat(100000); // 100k characters
      setMockPdfText(largeText);

      // Act
      const result = await extractTextFromPDF(largeBuffer);

      // Assert
      expect(result).toBe(largeText);
      expect(result.length).toBe(100000);
    });

    it('should extract text with special characters and formatting', async () => {
      // Arrange
      const buffer = Buffer.from('pdf with special chars');
      const textWithSpecialChars = `
        LÍNGUA PORTUGUESA: áéíóú àèìòù âêîôû ãõñç
        MATEMÁTICA: ≥ ≤ ≠ ∑ ∫ ∂ √ ∞
        PERCENTUAIS: 10% 25% 50% 75% 100%
      `;
      setMockPdfText(textWithSpecialChars);

      // Act
      const result = await extractTextFromPDF(buffer);

      // Assert
      expect(result).toContain('áéíóú');
      expect(result).toContain('≥ ≤ ≠');
      expect(result).toContain('10% 25%');
    });
  });
});