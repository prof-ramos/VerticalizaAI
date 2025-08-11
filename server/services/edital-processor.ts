// 📝 Processador especializado de editais usando template do TCU como referência

export interface ProcessedContent {
  disciplinas: Array<{
    nome: string;
    topicos: string[];
  }>;
}

export function processEditalWithTemplate(rawText: string): ProcessedContent {
  console.log('Starting template processing, text length:', rawText.length);
  
  // Debug: Let's see what the PDF contains
  console.log('Sample of raw PDF text:', rawText.substring(0, 1000));
  
  // Template baseado no CSV de exemplo do TCU
  const expectedStructure = {
    disciplinas: [{
      nome: "CONTEUDO_PROGRAMATICO",
      topicos: [] as string[]
    }]
  };

  // Encontrar seção do conteúdo programático com múltiplas estratégias
  let contentStart = rawText.search(/(ANEXO I|CONTEÚDO PROGRAMÁTICO|CONHECIMENTOS)/i);
  if (contentStart === -1) {
    contentStart = rawText.search(/(LÍNGUA PORTUGUESA|1\s+Interpretação de texto)/i);
  }
  if (contentStart === -1) {
    // Fallback - pegar texto após alguns padrões comuns
    contentStart = rawText.search(/(Especialização|BÁSICOS|ESPECÍFICOS)/i);
  }
  
  const relevantText = contentStart !== -1 ? rawText.substring(contentStart) : rawText;
  console.log('Content start position:', contentStart);
  console.log('Relevant text length:', relevantText.length);
  console.log('First 500 chars of relevant text:', relevantText.substring(0, 500));

  const lines = relevantText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let currentDiscipline = '';
  const topicos: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i < lines.length - 1 ? lines[i + 1] : '';

    // Detectar disciplinas (linhas específicas conhecidas)
    if (line.includes('LÍNGUA PORTUGUESA') ||
        line.includes('LÍNGUA INGLESA') ||
        line.includes('MATEMÁTICA FINANCEIRA') ||
        line.includes('CONTROLE EXTERNO') ||
        line.includes('ADMINISTRAÇÃO PÚBLICA') ||
        line.includes('DIREITO CONSTITUCIONAL') ||
        line.includes('DIREITO ADMINISTRATIVO') ||
        line.includes('DIREITO CIVIL') ||
        line.includes('DIREITO PROCESSUAL CIVIL') ||
        line.includes('SISTEMA NORMATIVO ANTICORRUPÇÃO') ||
        line.includes('ESTATÍSTICA') ||
        line.includes('RACIOCÍNIO LÓGICO')) {
      
      currentDiscipline = line.endsWith(':') ? line : line + ':';
      topicos.push(currentDiscipline);
      continue;
    }

    // Detectar tópicos principais numerados (1., 2., etc.)
    if (/^\d+\.?\s+.+/.test(line) && line.length > 8 && currentDiscipline) {
      // Garantir que termina com ponto final se não tem
      const formattedTopic = line.endsWith('.') ? line : line + '.';
      topicos.push(formattedTopic);
      continue;
    }

    // Detectar sub-tópicos (1.1., 2.1., etc.) - indentar com 3 espaços
    if (/^\d+\.\d+\.?\s+.+/.test(line)) {
      const formattedSubTopic = line.endsWith('.') ? line : line + '.';
      topicos.push(`   ${formattedSubTopic}`);
      continue;
    }

    // Detectar sub-sub-tópicos (1.1.1., etc.) - indentar com 6 espaços
    if (/^\d+\.\d+\.\d+\.?\s+.+/.test(line)) {
      const formattedSubSubTopic = line.endsWith('.') ? line : line + '.';
      topicos.push(`      ${formattedSubSubTopic}`);
      continue;
    }

    // Detectar tópicos com letras (a., b., etc.) - indentar com 3 espaços
    if (/^[a-z]\.\s+.+/i.test(line) && currentDiscipline) {
      const formattedLetterTopic = line.endsWith('.') ? line : line + '.';
      topicos.push(`   ${formattedLetterTopic}`);
      continue;
    }

    // Detectar tópicos com números romanos (i., ii., etc.) - indentar com 3 espaços
    if (/^[ivx]+\.\s+.+/i.test(line) && currentDiscipline) {
      const formattedRomanTopic = line.endsWith('.') ? line : line + '.';
      topicos.push(`   ${formattedRomanTopic}`);
      continue;
    }

    // Detectar linhas descritivas que podem ser parte de tópicos
    if (line.length > 20 && 
        !line.match(/^(TRIBUNAL|EDITAL|ANEXO|PÁGINA|MINISTÉRIO)/i) &&
        !line.match(/^\d{1,2}\/\d{1,2}\/\d{4}/) &&
        !line.match(/^Art\./) &&
        currentDiscipline &&
        topicos.length > 0) {
      
      // Se parece ser uma descrição detalhada de um tópico
      if (!line.includes(':') && line.length > 30) {
        topicos.push(`   ${line}.`);
      }
    }
  }

  expectedStructure.disciplinas[0].topicos = topicos;
  // Debug: let's see what we extracted
  console.log('Processed topics count:', topicos.length);
  console.log('First 5 topics:', topicos.slice(0, 5));
  console.log('Sample of relevant text lines:', lines.slice(0, 20));
  
  // If we found very few topics, let's try a more aggressive extraction
  if (topicos.length < 5) {
    console.log('Too few topics found, trying more aggressive extraction...');
    console.log('Lines containing "Interpretação":', lines.filter(l => l.includes('Interpretação')));
    console.log('Lines containing numbers:', lines.filter(l => /^\d+/.test(l)).slice(0, 10));
    
    // Look for any content that looks like edital topics
    for (const line of lines) {
      // Look for numbered items that could be topics
      if (/^\d+[\.\)\s]+.+/.test(line) && line.length > 15) {
        if (!topicos.includes(line)) {
          topicos.push(line.endsWith('.') ? line : line + '.');
        }
      }
      // Look for sub-items with decimal numbering
      else if (/^\d+\.\d+[\.\)\s]+.+/.test(line) && line.length > 10) {
        if (!topicos.includes(`   ${line}`)) {
          topicos.push(`   ${line.endsWith('.') ? line : line + '.'}`);
        }
      }
      // Look for content with specific keywords
      else if ((line.includes('Interpretação') || line.includes('Compreensão') || 
                line.includes('linguagem') || line.includes('texto')) && line.length > 20) {
        if (!topicos.includes(line)) {
          topicos.push(line.endsWith('.') ? line : line + '.');
        }
      }
    }
  }
  
  expectedStructure.disciplinas[0].topicos = topicos;
  return expectedStructure;
}

export function generateCSVFromProcessedContent(processedContent: ProcessedContent): string {
  const lines = ['conteudo,estudado,revisado'];
  
  if (processedContent.disciplinas && processedContent.disciplinas.length > 0) {
    const disciplina = processedContent.disciplinas[0];
    if (disciplina.topicos) {
      disciplina.topicos.forEach((topico: string) => {
        const cleanTopico = topico.replace(/"/g, '""');
        lines.push(`"${cleanTopico}",,`);
      });
    }
  }
  
  return lines.join('\n');
}