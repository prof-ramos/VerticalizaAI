import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

const PROMPT = `Analise este edital de concurso público e extraia o conteúdo programático. Retorne APENAS o JSON sem texto adicional.

REGRAS RÍGIDAS:
1. Mantenha numeração exata (1., 1.1., a., i.)
2. Preserve texto completo dos tópicos
3. Use ":" após disciplinas
4. Indente sub-tópicos com espaços: "   1.1."

FORMATO JSON OBRIGATÓRIO:
{
  "disciplinas": [
    {
      "nome": "CONTEUDO_PROGRAMATICO", 
      "topicos": [
        "DISCIPLINA:",
        "1. Tópico exato...",
        "   1.1. Sub-tópico...",
        "PRÓXIMA DISCIPLINA:",
        "1. Tópico..."
      ]
    }
  ]
}

TEXTO: {texto_edital}`;

export async function processEditalWithGemini(editalText: string): Promise<any> {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY not found in environment variables');
    }

    console.log('Starting Gemini processing with text length:', editalText.length);
    
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash", // Voltar para flash - mais estável
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 8192,
        responseMimeType: "application/json", // Forçar JSON válido
      },
    });
    
    // Focar apenas no conteúdo programático
    const contentStart = editalText.search(/(CONTEÚDO PROGRAMÁTICO|CONHECIMENTOS|ANEXO I)/i);
    let relevantText = contentStart !== -1 ? editalText.substring(contentStart) : editalText;
    
    // Limitar a 30k chars para evitar token overflow
    relevantText = relevantText.substring(0, 30000);
    const prompt = PROMPT.replace('{texto_edital}', relevantText);
    
    console.log('Sending prompt to Gemini...');
    const result = await model.generateContent(prompt);
    
    const response = result.response;
    let text = response.text();
    
    console.log('Gemini response received, length:', text.length);
    console.log('First 500 chars of response:', text.substring(0, 500));
    
    let structuredContent;
    
    try {
      // Try direct parsing first
      structuredContent = JSON.parse(text);
    } catch (error) {
      console.log('Direct JSON parse failed, attempting repair...');
      
      // Extract JSON structure even if truncated
      const jsonStart = text.indexOf('{');
      let jsonText = text.substring(jsonStart);
      
      // Try to complete the truncated JSON
      if (!jsonText.includes('}]}}')) {
        // Count opening and closing braces to balance
        const openBraces = (jsonText.match(/\{/g) || []).length;
        const closeBraces = (jsonText.match(/\}/g) || []).length;
        const openBrackets = (jsonText.match(/\[/g) || []).length;
        const closeBrackets = (jsonText.match(/\]/g) || []).length;
        
        // Add missing closing brackets and braces
        const missingBrackets = openBrackets - closeBrackets;
        const missingBraces = openBraces - closeBraces;
        
        for (let i = 0; i < missingBrackets; i++) {
          jsonText += ']';
        }
        for (let i = 0; i < missingBraces; i++) {
          jsonText += '}';
        }
        
        // Remove any trailing commas before closing
        jsonText = jsonText.replace(/,\s*]/g, ']').replace(/,\s*}/g, '}');
      }
      
      try {
        structuredContent = JSON.parse(jsonText);
        console.log('Successfully repaired truncated JSON');
      } catch (repairError) {
        console.error('JSON repair failed:', repairError);
        console.log('Attempted to parse:', jsonText);
        
        // Fallback: try to extract what we can
        const partialMatch = text.match(/\{[\s\S]*"disciplinas":\s*\[[\s\S]*?\{[\s\S]*?"topicos":\s*\[([^\]]*)/);
        if (partialMatch) {
          // Create a minimal valid structure from what we can extract
          structuredContent = {
            disciplinas: [{
              nome: "CONTEUDO_PROGRAMATICO_PARCIAL",
              topicos: ["Processamento incompleto - tente novamente"]
            }]
          };
          console.log('Created fallback structure from partial data');
        } else {
          throw new Error('Failed to parse JSON response from Gemini');
        }
      }
    }
    
    // Check for error response
    if (structuredContent.erro) {
      return null;
    }
    
    return structuredContent;
  } catch (error) {
    console.error('Error processing with Gemini:', error);
    throw new Error('Failed to process content with AI');
  }
}