# Replit.md

## Overview

Verticaliza-AI is a specialized web application designed to automate the analysis and structuring of Brazilian public exam (concurso público) announcements. The system extracts content from PDF edital documents and uses Google's Gemini AI to organize the programmatic content into a structured, hierarchical format. Users can upload PDF files, receive AI-processed results, and export the structured content as CSV files or copy it to their clipboard for further use in study planning tools.

## Recent Changes (January 2025)

✓ **Database Integration**: Successfully migrated from memory storage to PostgreSQL with Drizzle ORM
✓ **Complete Backend API**: Implemented full CRUD operations for editals and verticalized content
✓ **AI Processing Service**: Integrated Google Gemini 2.5-flash for content extraction and structuring
✓ **PDF Processing**: Added pdf-parse library for extracting text from uploaded PDF files
✓ **Frontend Components**: Built complete React interface with upload, processing, and results sections
✓ **File Upload System**: Implemented multer-based file upload with 20MB limit and PDF-only validation
✓ **Export Features**: Added CSV download and clipboard copy functionality
✓ **Application Running**: Server successfully running on port 5000 with all services integrated

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with **React** and **TypeScript**, using **Vite** as the build tool and development server. The UI leverages **shadcn/ui** components built on top of **Radix UI** primitives with **Tailwind CSS** for styling. State management is handled through **TanStack Query** (React Query) for server state and local React state for UI interactions.

The frontend follows a component-based architecture with four main application states:
- Upload state for file selection and validation
- Processing state with progress indicators
- Results state displaying structured content
- Error state for handling failures

**Key architectural decisions:**
- Single-page application with client-side routing via Wouter
- Component composition pattern using shadcn/ui for consistent design
- Form handling with React Hook Form and Zod validation
- File upload with client-side validation (PDF only, 20MB limit)

### Backend Architecture
The server is built with **Express.js** and **TypeScript**, following a layered architecture pattern:

**API Layer:** RESTful endpoints handling file uploads and processing requests
**Service Layer:** Business logic separation with dedicated services for PDF processing and AI integration
**Data Layer:** PostgreSQL database with Drizzle ORM for type-safe database operations

**Key architectural decisions:**
- Multer middleware for handling multipart file uploads with memory storage
- Service-oriented architecture separating concerns (PDF extraction, AI processing, data persistence)
- Error handling middleware with consistent JSON error responses
- Environment-specific configuration management

### Data Storage Solutions
The application uses **PostgreSQL** as the primary database with **Drizzle ORM** providing type-safe database operations. The schema includes three main entities:

**Users table:** For future authentication implementation (currently unused in MVP)
**Editals table:** Stores uploaded PDF metadata and extracted raw text
**VerticalizedContents table:** Stores AI-processed results in JSON format with optional CSV exports

**Key architectural decisions:**
- Relational design with foreign key relationships
- JSON storage for flexible AI response structures
- Separate storage of raw text and processed content for audit trails
- Optional user association for future multi-tenant capabilities

### Authentication and Authorization
Currently implemented as an anonymous system for MVP. The database schema includes user tables for future authentication implementation, but no authentication middleware is currently active.

**Future considerations:**
- JWT-based authentication
- Session management with connect-pg-simple
- Role-based access control for premium features

## External Dependencies

### AI Services
**Google Gemini AI (2.5-flash model):** Primary AI service for content extraction and structuring
- Purpose: Natural language processing of Brazilian edital documents
- Integration: REST API calls with structured prompt engineering
- Configuration: Requires GEMINI_API_KEY environment variable
- Response format: JSON with hierarchical discipline/topic structure

### Database Services
**Neon PostgreSQL:** Cloud-hosted PostgreSQL database
- Purpose: Persistent storage of processed content and metadata
- Integration: Connection via @neondatabase/serverless with connection pooling
- Configuration: Requires DATABASE_URL environment variable
- Migration management: Drizzle Kit for schema migrations

### File Processing Services
**pdf-parse library:** PDF text extraction
- Purpose: Converting uploaded PDF files to plain text
- Integration: Server-side processing of Buffer objects
- Limitations: Text-based extraction only, no OCR capabilities

### Development and Deployment
**Vite:** Frontend build tool and development server
- Features: Hot module replacement, TypeScript support, React Fast Refresh
- Configuration: Custom alias resolution for @ imports

**Replit Integration:** 
- Development environment with runtime error overlay
- Cartographer plugin for enhanced debugging (development only)
- Environment detection via REPL_ID variable

**ESBuild:** Production backend compilation
- Purpose: Bundle Node.js server code for deployment
- Configuration: ESM output format with external package resolution

### UI and Styling Dependencies
**Radix UI:** Headless component primitives for accessibility
**Tailwind CSS:** Utility-first CSS framework with custom color variables
**Material Icons:** Icon system for UI elements
**shadcn/ui:** Pre-built component library with consistent theming

### Build and Development Tools
**TypeScript:** Type safety across full stack
**ESLint/Prettier:** Code quality and formatting (configured via package.json)
**PostCSS:** CSS processing with Tailwind and Autoprefixer

## 📚 Documentação para Desenvolvedores

O projeto inclui documentação abrangente para facilitar o desenvolvimento e contribuições:

### **DEVELOPER_GUIDE.md**
Guia completo cobrindo:
- Configuração inicial e pré-requisitos
- Estrutura detalhada do projeto e arquitetura
- Fluxo de desenvolvimento e convenções
- Estratégia de testes (unitários, integração, e2e)
- Solução de problemas comuns
- Guidelines de contribuição

### **Scripts Utilitários**
- `scripts/check-env.sh`: Verificação automática de variáveis de ambiente
- `.env.example`: Template de configuração com documentação

### **Configuração de Testes**
- **vitest.config.ts**: Configuração completa do framework de testes
- **test/setup/**: Setup e mocks para testes consistentes
- Cobertura de código configurada com limites mínimos
- Mocks para Google Gemini API e processamento de PDF

### **Comandos Disponíveis**
```bash
npm run setup          # Setup inicial completo
npm run check-env       # Verificar configuração
npm run test           # Executar todos os testes
npm run test:coverage  # Testes com cobertura
npm run test:watch     # Testes em modo watch
```