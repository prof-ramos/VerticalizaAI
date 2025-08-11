# 🚀 Guia do Desenvolvedor - Verticaliza-AI

> **Verticaliza-AI** é uma aplicação web que automatiza a análise e estruturação de editais de concursos públicos brasileiros usando Google Gemini AI.

## 📋 Índice

1. [Configuração Inicial](#-configuração-inicial)
2. [Estrutura do Projeto](#-estrutura-do-projeto)
3. [Fluxo de Desenvolvimento](#-fluxo-de-desenvolvimento)
4. [Estratégia de Testes](#-estratégia-de-testes)
5. [Solução de Problemas](#-solução-de-problemas)
6. [Contribuição](#-contribuição)
7. [FAQ](#-faq)

---

## 🛠 Configuração Inicial

### Pré-requisitos do Sistema

| Ferramenta | Versão Mínima | Recomendada | Verificação |
|------------|---------------|-------------|-------------|
| **Node.js** | 20.0.0 | 20.16.11 | `node --version` |
| **npm** | 10.0.0 | 10.x | `npm --version` |
| **Git** | 2.34+ | Latest | `git --version` |
| **PostgreSQL** | 14+ | 16+ | `psql --version` |

### 1. Clonagem e Instalação

```bash
# Clonar o repositório
git clone <repository-url>
cd verticaliza-ai

# Instalar dependências
npm install

# Verificar instalação
npm run check
```

### 2. Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# .env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/verticaliza_ai"
PGHOST="localhost"
PGPORT="5432"
PGUSER="your_username"
PGPASSWORD="your_password"
PGDATABASE="verticaliza_ai"

# Google Gemini API
GEMINI_API_KEY="your_gemini_api_key"

# Development
NODE_ENV="development"
```

#### 🔑 Obtendo as Chaves de API

**Google Gemini API:**
1. Acesse [Google AI Studio](https://aistudio.google.com/)
2. Crie uma nova API Key
3. Copie a chave e adicione ao `.env`

### 3. Setup do Banco de Dados

```bash
# Criar banco de dados PostgreSQL
createdb verticaliza_ai

# Executar migrações
npm run db:push

# Verificar conexão
npm run db:check
```

### 4. Inicialização do Projeto

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Executar produção
npm start
```

O projeto estará disponível em `http://localhost:5000`

---

## 🏗 Estrutura do Projeto

### Organização de Diretórios

```
verticaliza-ai/
├── 📁 client/                 # Frontend React + TypeScript
│   ├── 📁 src/
│   │   ├── 📁 components/     # Componentes React reutilizáveis
│   │   │   ├── 📁 ui/         # Componentes shadcn/ui
│   │   │   ├── hero-section.tsx
│   │   │   ├── upload-section.tsx
│   │   │   ├── processing-section.tsx
│   │   │   └── results-section.tsx
│   │   ├── 📁 hooks/          # Custom React hooks
│   │   ├── 📁 lib/            # Utilitários e configurações
│   │   ├── 📁 pages/          # Páginas da aplicação
│   │   └── main.tsx           # Entry point do React
│   └── index.html             # Template HTML
├── 📁 server/                 # Backend Express + TypeScript
│   ├── 📁 services/           # Serviços de negócio
│   │   ├── gemini.ts          # Integração Google Gemini
│   │   └── pdf.ts             # Processamento de PDF
│   ├── db.ts                  # Configuração do banco
│   ├── index.ts               # Entry point do servidor
│   ├── routes.ts              # Definição de rotas API
│   ├── storage.ts             # Camada de acesso a dados
│   └── vite.ts                # Configuração Vite middleware
├── 📁 shared/                 # Código compartilhado
│   └── schema.ts              # Schemas Drizzle ORM + Zod
├── 📁 test/                   # Testes automatizados
├── package.json               # Dependências e scripts
├── drizzle.config.ts          # Configuração ORM
├── vite.config.ts             # Configuração build tool
└── replit.md                  # Documentação do projeto
```

### Arquitetura Geral

```mermaid
graph TB
    A[Cliente Browser] --> B[Vite Dev Server]
    B --> C[React Frontend]
    C --> D[Express API Server]
    D --> E[Multer Upload]
    D --> F[PDF Service]
    D --> G[Gemini AI Service]
    D --> H[PostgreSQL Database]
    F --> I[pdf-parse]
    G --> J[Google Gemini API]
    H --> K[Drizzle ORM]
```

### Tecnologias Utilizadas

#### Frontend Stack
- **React 18** + **TypeScript** - Interface de usuário
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização utilitária
- **shadcn/ui** - Componentes pré-construídos
- **TanStack Query** - Gerenciamento de estado servidor
- **Wouter** - Roteamento client-side

#### Backend Stack
- **Express.js** - Framework web
- **TypeScript** - Tipagem estática
- **Drizzle ORM** - Object-Relational Mapping
- **PostgreSQL** - Banco de dados relacional
- **Multer** - Upload de arquivos
- **pdf-parse** - Extração de texto PDF

#### Integração AI
- **Google Gemini 2.5-flash** - Processamento de linguagem natural

### Padrões de Nomenclatura

#### Arquivos e Diretórios
```
kebab-case/           # Diretórios
component-name.tsx    # Componentes React
service-name.ts       # Serviços
```

#### Código TypeScript
```typescript
// Interfaces e Types
interface EditalProcessingResult {}
type AppState = 'upload' | 'processing' | 'results';

// Funções
function processEditalWithGemini() {}
const handleFileUpload = () => {};

// Constantes
const GEMINI_API_ENDPOINT = "...";
const MAX_FILE_SIZE = 20 * 1024 * 1024;

// Componentes React
export function UploadSection() {}
```

#### Banco de Dados
```sql
-- Tabelas: snake_case
users, editals, verticalized_contents

-- Colunas: snake_case
user_id, file_name, created_at
```

### Convenções de Código

#### Imports
```typescript
// 1. Node modules
import { useState } from "react";
import express from "express";

// 2. Absolute imports (usando @)
import { Button } from "@/components/ui/button";
import { storage } from "@shared/storage";

// 3. Relative imports
import { extractTextFromPDF } from "./services/pdf";
```

#### Estrutura de Componentes React
```typescript
// 1. Imports
import { useState } from "react";
import { Button } from "@/components/ui/button";

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  onSubmit: (data: FormData) => void;
}

// 3. Component
export function ComponentName({ title, onSubmit }: ComponentProps) {
  // 3.1 State
  const [isLoading, setIsLoading] = useState(false);
  
  // 3.2 Effects
  useEffect(() => {}, []);
  
  // 3.3 Handlers
  const handleSubmit = () => {};
  
  // 3.4 Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

---

## 🔄 Fluxo de Desenvolvimento

### Git Workflow

#### Branch Strategy
```bash
main                    # Produção estável
├── develop            # Integração e testes
├── feature/nova-funcionalidade
├── bugfix/correcao-upload
└── hotfix/security-patch
```

#### Fluxo de Feature
```bash
# 1. Criar branch da develop
git checkout develop
git pull origin develop
git checkout -b feature/nome-da-feature

# 2. Desenvolver com commits atômicos
git add .
git commit -m "feat: adicionar validação de PDF"

# 3. Push e Pull Request
git push origin feature/nome-da-feature
# Criar PR para develop via interface GitHub
```

#### Convenção de Commits
```bash
feat: nova funcionalidade
fix: correção de bug
docs: documentação
style: formatação/lint
refactor: refatoração
test: testes
chore: build/config
```

### Code Review Process

#### Checklist do Revisor
- [ ] **Funcionalidade**: Código funciona conforme especificado
- [ ] **Qualidade**: Segue padrões de nomenclatura e estrutura
- [ ] **Performance**: Não introduz gargalos desnecessários
- [ ] **Segurança**: Não expõe dados sensíveis ou vulnerabilidades
- [ ] **Testes**: Inclui testes adequados para novas funcionalidades
- [ ] **Documentação**: Atualiza documentação relevante

#### Ferramentas de Qualidade
```bash
# Verificação de tipos
npm run check

# Linting automático
npm run lint

# Formatação de código
npm run format

# Auditoria de segurança
npm audit
```

### Deploy e Release

#### Ambientes
```bash
# Desenvolvimento
npm run dev

# Staging/Homologação
npm run build:staging
npm run start:staging

# Produção
npm run build
npm run start
```

#### Processo de Release
1. **Merge para main** após aprovação em develop
2. **Tag de versão** seguindo SemVer (v1.2.3)
3. **Deploy automático** para produção
4. **Smoke tests** pós-deploy
5. **Documentação** de release notes

---

## 🧪 Estratégia de Testes

### Estrutura de Testes
```
test/
├── 📁 unit/                   # Testes unitários
│   ├── services/
│   │   ├── pdf.test.ts
│   │   └── gemini.test.ts
│   └── components/
│       └── upload-section.test.tsx
├── 📁 integration/            # Testes de integração
│   ├── api/
│   │   └── editais.test.ts
│   └── database/
│       └── storage.test.ts
├── 📁 e2e/                    # Testes end-to-end
│   └── edital-processing.test.ts
└── 📁 fixtures/               # Dados de teste
    └── sample-edital.pdf
```

### Configuração de Testes

#### Dependências de Teste
```bash
npm install -D \
  vitest \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  msw \
  playwright
```

#### Scripts de Teste
```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run unit/",
    "test:integration": "vitest run integration/",
    "test:e2e": "playwright test",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch"
  }
}
```

### Tipos de Testes

#### 1. Testes Unitários (70%)
```typescript
// test/unit/services/pdf.test.ts
import { describe, it, expect } from 'vitest';
import { extractTextFromPDF } from '@/server/services/pdf';

describe('PDF Service', () => {
  it('should extract text from valid PDF', async () => {
    const mockBuffer = await readFile('./fixtures/sample-edital.pdf');
    const result = await extractTextFromPDF(mockBuffer);
    
    expect(result).toContain('LÍNGUA PORTUGUESA');
    expect(result.length).toBeGreaterThan(100);
  });

  it('should throw error for invalid PDF', async () => {
    const invalidBuffer = Buffer.from('not a pdf');
    
    await expect(extractTextFromPDF(invalidBuffer))
      .rejects.toThrow('Failed to extract text from PDF');
  });
});
```

#### 2. Testes de Integração (20%)
```typescript
// test/integration/api/editals.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '@/server/index';

describe('POST /api/editals/process', () => {
  beforeEach(async () => {
    await cleanDatabase();
  });

  it('should process valid PDF and return structured content', async () => {
    const response = await request(app)
      .post('/api/editals/process')
      .attach('pdf', './fixtures/sample-edital.pdf')
      .expect(200);

    expect(response.body).toHaveProperty('edital');
    expect(response.body).toHaveProperty('verticalizedContent');
    expect(response.body.verticalizedContent.structuredJson).toHaveProperty('disciplinas');
  });
});
```

#### 3. Testes End-to-End (10%)
```typescript
// test/e2e/edital-processing.test.ts
import { test, expect } from '@playwright/test';

test('complete edital processing flow', async ({ page }) => {
  await page.goto('/');
  
  // Upload PDF
  await page.locator('input[type="file"]').setInputFiles('./fixtures/sample-edital.pdf');
  await page.locator('button:has-text("Processar Edital")').click();
  
  // Wait for processing
  await expect(page.locator('text=Processando')).toBeVisible();
  
  // Verify results
  await expect(page.locator('text=Resultado do Processamento')).toBeVisible({ timeout: 30000 });
  await expect(page.locator('text=LÍNGUA PORTUGUESA')).toBeVisible();
  
  // Test CSV download
  const downloadPromise = page.waitForEvent('download');
  await page.locator('button:has-text("Baixar CSV")').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('edital_verticalizado.csv');
});
```

### Cobertura de Código

#### Meta de Cobertura
- **Statements**: 80%+
- **Branches**: 75%+
- **Functions**: 85%+
- **Lines**: 80%+

#### Relatório de Cobertura
```bash
npm run test:coverage
# Gera relatório em coverage/index.html
```

### Testes de Performance

#### Configuração de Benchmark
```typescript
// test/performance/pdf-processing.bench.ts
import { bench, describe } from 'vitest';
import { extractTextFromPDF } from '@/server/services/pdf';

describe('PDF Processing Performance', () => {
  bench('extract text from 1MB PDF', async () => {
    const buffer = await readFile('./fixtures/large-edital.pdf');
    await extractTextFromPDF(buffer);
  });

  bench('extract text from 10MB PDF', async () => {
    const buffer = await readFile('./fixtures/xl-edital.pdf');
    await extractTextFromPDF(buffer);
  });
});
```

---

## 🔍 Solução de Problemas

### Problemas Frequentes

#### 1. Erro de Conexão com Banco de Dados
```bash
# Sintoma
Error: connect ECONNREFUSED 127.0.0.1:5432

# Diagnóstico
npm run db:check

# Soluções
# 1. Verificar se PostgreSQL está rodando
sudo systemctl status postgresql

# 2. Verificar variáveis de ambiente
echo $DATABASE_URL

# 3. Testar conexão manual
psql $DATABASE_URL
```

#### 2. Erro de API Key do Gemini
```bash
# Sintoma
Error: GEMINI_API_KEY not found in environment variables

# Soluções
# 1. Verificar arquivo .env
cat .env | grep GEMINI_API_KEY

# 2. Validar chave na Google AI Studio
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=$GEMINI_API_KEY"
```

#### 3. Falha no Upload de PDF
```bash
# Sintoma
Error: Only PDF files are allowed

# Diagnóstico
# Verificar MIME type do arquivo
file --mime-type arquivo.pdf

# Soluções
# 1. Verificar se é PDF válido
# 2. Confirmar tamanho < 20MB
ls -lh arquivo.pdf

# 3. Testar com PDF conhecido
curl -X POST -F "pdf=@test/fixtures/sample-edital.pdf" http://localhost:5000/api/editals/process
```

### Logs e Debugging

#### Configuração de Logs
```typescript
// server/utils/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/app.log' })
  ]
});
```

#### Debug Mode
```bash
# Ativar logs detalhados
DEBUG=verticaliza:* npm run dev

# Logs específicos do Gemini
DEBUG=gemini npm run dev
```

#### Monitoramento em Produção
```bash
# Verificar logs de aplicação
tail -f logs/app.log

# Monitorar performance
npm run monitor

# Verificar saúde da API
curl http://localhost:5000/health
```

### Performance Issues

#### 1. Processamento Lento de PDF
```bash
# Diagnóstico
# Verificar tamanho do arquivo
ls -lh arquivo.pdf

# Verificar tempo de processamento
time curl -X POST -F "pdf=@arquivo.pdf" http://localhost:5000/api/editals/process

# Soluções
# 1. Otimizar PDF antes do upload
# 2. Implementar processamento assíncrono
# 3. Adicionar cache de resultados
```

#### 2. Alto Uso de Memória
```bash
# Diagnóstico
# Monitorar uso de memória
npm run memory-usage

# Verificar vazamentos
node --inspect server/index.ts

# Soluções
# 1. Implementar garbage collection
# 2. Limitar tamanho de upload
# 3. Streaming de arquivos grandes
```

### Problemas de Configuração

#### Variáveis de Ambiente Faltando
```bash
# Script de verificação
# scripts/check-env.sh
#!/bin/bash

required_vars=("DATABASE_URL" "GEMINI_API_KEY")

for var in "${required_vars[@]}"; do
  if [[ -z "${!var}" ]]; then
    echo "❌ $var não está definida"
    exit 1
  else
    echo "✅ $var está definida"
  fi
done

echo "🎉 Todas as variáveis estão configuradas!"
```

#### Conflitos de Porta
```bash
# Verificar portas em uso
lsof -i :5000

# Matar processo na porta
kill -9 $(lsof -t -i:5000)

# Usar porta alternativa
PORT=3001 npm run dev
```

---

## 🤝 Contribuição

### Como Contribuir

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie** uma branch para sua feature
4. **Desenvolva** seguindo os padrões estabelecidos
5. **Teste** sua implementação
6. **Submeta** um Pull Request

### Guidelines de Contribuição

#### Código
- Siga os padrões de nomenclatura estabelecidos
- Mantenha funções pequenas e focadas
- Adicione testes para novas funcionalidades
- Documente APIs públicas com JSDoc
- Use TypeScript para tipagem forte

#### Documentação
- Atualize DEVELOPER_GUIDE.md se necessário
- Adicione comentários para lógica complexa
- Mantenha README.md atualizado
- Documente breaking changes

#### Pull Requests
- Título descritivo e conciso
- Descrição detalhada das mudanças
- Link para issues relacionadas
- Screenshots para mudanças de UI
- Checklist de teste completo

### Code of Conduct

- Seja respeitoso e inclusivo
- Foque no código, não na pessoa
- Aceite feedback construtivo
- Ajude outros desenvolvedores
- Mantenha discussões profissionais

---

## ❓ FAQ

### Perguntas Gerais

**Q: Qual versão do Node.js devo usar?**
A: Use Node.js 20.16.11 ou superior. Recomendamos usar nvm para gerenciar versões.

**Q: Por que usar Drizzle ORM ao invés de Prisma?**
A: Drizzle oferece melhor performance, type safety mais rigorosa e menos overhead em runtime.

**Q: Posso usar outro banco além do PostgreSQL?**
A: O projeto foi otimizado para PostgreSQL. Mudanças para outros bancos requerem adaptações no schema.

### Problemas Técnicos

**Q: Erro "Module not found" ao importar @shared/schema**
A: Verifique se o path mapping está configurado corretamente no tsconfig.json e vite.config.ts.

**Q: Gemini retorna erro 429 (Rate Limit)**
A: Implemente retry logic ou use uma chave API com limite maior. Considere cache para evitar chamadas desnecessárias.

**Q: PDF não é processado corretamente**
A: Verifique se o PDF contém texto extraível (não é apenas imagem). Use ferramentas OCR se necessário.

### Desenvolvimento

**Q: Como adicionar nova funcionalidade?**
A: 1) Crie issue, 2) Faça design técnico, 3) Implemente com testes, 4) Submeta PR.

**Q: Como fazer debug do processamento da IA?**
A: Use logs estruturados, salve prompts/respostas em desenvolvimento, e teste com editais conhecidos.

**Q: Posso rodar apenas o frontend ou backend?**
A: Sim, use `npm run dev:client` ou `npm run dev:server` para desenvolvimento isolado.

---

## 📚 Referências

### Documentação Oficial
- [React 18 Docs](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [Google Gemini API](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

### Ferramentas de Desenvolvimento
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Testing Framework](https://vitest.dev/)
- [Playwright E2E Testing](https://playwright.dev/)
- [shadcn/ui Components](https://ui.shadcn.com/)

### Recursos de Aprendizado
- [Full Stack TypeScript](https://fullstackopen.com/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [API Design Guidelines](https://docs.microsoft.com/en-us/azure/architecture/best-practices/api-design)

---

## 📝 Changelog

### v1.0.0 (2024-01-XX)
- ✨ Implementação inicial do MVP
- 🔧 Setup completo da infraestrutura
- 📱 Interface de upload e processamento
- 🤖 Integração com Google Gemini AI
- 📊 Export para CSV
- 🗄️ Persistência em PostgreSQL

### Roadmap
- [ ] v1.1.0 - Autenticação de usuários
- [ ] v1.2.0 - Cache inteligente
- [ ] v1.3.0 - Processamento em lote
- [ ] v2.0.0 - OCR para PDFs escaneados

---

**Desenvolvido com ❤️ pela equipe Verticaliza-AI**

Para dúvidas ou suporte, abra uma [issue](link-to-issues) ou entre em contato com a equipe de desenvolvimento.