# 🤝 Guia de Contribuição - Verticaliza-AI

Obrigado por seu interesse em contribuir com o Verticaliza-AI! Este documento fornece diretrizes para contribuições efetivas.

## 🚀 Primeiros Passos

### 1. Setup do Ambiente
```bash
# 1. Fork e clone o repositório
git clone https://github.com/seu-usuario/verticaliza-ai.git
cd verticaliza-ai

# 2. Setup automático
npm run setup

# 3. Verificar configuração
npm run check-env
```

### 2. Leia a Documentação
- **DEVELOPER_GUIDE.md**: Guia técnico completo
- **replit.md**: Visão geral do projeto e arquitetura

## 📋 Tipos de Contribuição

### 🐛 Reportar Bugs
- Use o template de issue para bugs
- Inclua passos para reproduzir o problema
- Adicione screenshots se aplicável
- Especifique versão do Node.js e sistema operacional

### ✨ Sugerir Features
- Use o template de issue para features
- Descreva o problema que a feature resolve
- Proponha uma solução detalhada
- Considere impacto na arquitetura existente

### 🔧 Contribuir Código
- Fork o repositório
- Crie branch para sua feature
- Siga as convenções de código
- Adicione testes adequados
- Submeta Pull Request

## 📝 Padrões de Desenvolvimento

### Convenções de Commit
```bash
feat: adicionar validação de PDF
fix: corrigir erro de upload
docs: atualizar guia de contribuição
style: corrigir formatação
refactor: simplificar lógica de processamento
test: adicionar testes para Gemini service
chore: atualizar dependências
```

### Estrutura de Branch
```
main                    # Produção
├── develop            # Integração
├── feature/nome       # Novas funcionalidades
├── bugfix/descricao   # Correções
└── hotfix/critico     # Correções urgentes
```

### Padrões de Código

#### TypeScript
- Use tipagem forte, evite `any`
- Prefira interfaces para objetos
- Use enums para constantes relacionadas
- Documente APIs públicas com JSDoc

#### React
- Use functional components
- Prefira hooks customizados para lógica compartilhada
- Mantenha componentes pequenos e focados
- Use PropTypes ou TypeScript para validação

#### Nomenclatura
```typescript
// Arquivos: kebab-case
user-profile.tsx
api-client.ts

// Componentes: PascalCase
export function UserProfile() {}

// Funções: camelCase
function processEditalData() {}

// Constantes: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 20 * 1024 * 1024;

// Types/Interfaces: PascalCase
interface EditalProcessingResult {}
type AppState = 'loading' | 'success' | 'error';
```

### Qualidade de Código

#### Testes Obrigatórios
- **Novas features**: Cobertura mínima de 80%
- **Bug fixes**: Teste que previne regressão
- **APIs**: Testes de integração
- **Componentes**: Testes de renderização e interação

#### Exemplo de Teste
```typescript
describe('UploadSection', () => {
  it('should reject non-PDF files', async () => {
    render(<UploadSection {...defaultProps} />);
    
    const fileInput = screen.getByLabelText(/upload/i);
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });
    
    await userEvent.upload(fileInput, file);
    
    expect(screen.getByText(/apenas arquivos PDF/i)).toBeInTheDocument();
  });
});
```

#### Code Review Checklist
- [ ] Código funciona conforme especificado
- [ ] Testes incluídos e passando
- [ ] Documentação atualizada
- [ ] Sem console.log ou debug code
- [ ] Performance não afetada negativamente
- [ ] Segurança considerada
- [ ] Acessibilidade mantida

## 🧪 Executar Testes

```bash
# Todos os testes
npm test

# Testes específicos
npm run test:unit
npm run test:integration

# Com cobertura
npm run test:coverage

# Em modo watch
npm run test:watch
```

### Metas de Cobertura
- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 85%
- **Lines**: 80%

## 📦 Processo de Pull Request

### 1. Preparação
```bash
# Sincronizar com main
git checkout main
git pull upstream main

# Criar branch feature
git checkout -b feature/minha-feature

# Fazer mudanças e commits
git add .
git commit -m "feat: adicionar nova funcionalidade"

# Push para fork
git push origin feature/minha-feature
```

### 2. Submissão
- Crie PR do seu fork para o repositório principal
- Use template de PR fornecido
- Título descritivo e conciso
- Descrição detalhada das mudanças
- Link issues relacionadas
- Marque reviewers apropriados

### 3. Template de PR
```markdown
## 📝 Descrição
Breve descrição das mudanças realizadas.

## 🔗 Issue Relacionada
Resolve #123

## 🧪 Tipo de Mudança
- [ ] Bug fix
- [ ] Nova feature
- [ ] Breaking change
- [ ] Documentação

## ✅ Checklist
- [ ] Testes incluídos
- [ ] Documentação atualizada
- [ ] Self-review realizado
- [ ] Sem conflitos de merge

## 📸 Screenshots (se aplicável)
```

### 4. Review Process
- **Aprovação automática**: 2+ reviewers aprovam
- **Mudanças solicitadas**: Endereçar feedback
- **CI/CD**: Todos os checks devem passar
- **Merge**: Squash and merge preferido

## 🔒 Segurança

### Diretrizes de Segurança
- Nunca commite chaves de API ou secrets
- Use variáveis de ambiente para configuração
- Valide entrada do usuário
- Sanitize dados antes de armazenar
- Reporte vulnerabilidades via email privado

### Dados Sensíveis
```typescript
// ❌ Nunca faça isso
const apiKey = "sk-1234567890abcdef";

// ✅ Use variáveis de ambiente
const apiKey = process.env.GEMINI_API_KEY;

// ✅ Valide antes de usar
if (!apiKey) {
  throw new Error('GEMINI_API_KEY não configurada');
}
```

## 📞 Comunicação

### Canais
- **Issues**: Bugs, features, discussões técnicas
- **Discussions**: Perguntas gerais, ideias
- **Email**: Questões de segurança sensíveis

### Etiqueta
- Seja respeitoso e construtivo
- Foque no código, não na pessoa
- Aceite feedback graciosamente
- Ajude outros desenvolvedores
- Mantenha discussões profissionais

## 🎯 Roadmap e Prioridades

### Próximas Features
1. **Autenticação de usuários** (Q1 2024)
2. **Cache inteligente** (Q1 2024)
3. **Processamento em lote** (Q2 2024)
4. **OCR para PDFs escaneados** (Q2 2024)

### Áreas que Precisam de Ajuda
- Otimização de performance
- Testes end-to-end
- Documentação de API
- Acessibilidade (a11y)
- Internacionalização (i18n)

## 🏆 Reconhecimento

Contribuidores são reconhecidos através de:
- Lista de contribuidores no README
- Menção em release notes para contribuições significativas
- Badge de contribuidor ativo

## 📚 Recursos Adicionais

### Documentação
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)

### Ferramentas Recomendadas
- **VSCode** com extensões TypeScript e React
- **Git GUI**: GitKraken, SourceTree ou similar
- **API Testing**: Postman ou Insomnia

---

**Agradecemos sua contribuição para tornar o Verticaliza-AI ainda melhor!** 🚀