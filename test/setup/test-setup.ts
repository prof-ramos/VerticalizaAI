// 🧪 Setup global para testes - Verticaliza-AI

import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// 🗄️ Setup do banco de dados de teste
import { setupTestDatabase, cleanupTestDatabase } from './database-setup';

// 🤖 Mock das APIs externas
import './mocks/gemini-mock';
import './mocks/pdf-mock';

// 🔧 Configuração global antes de todos os testes
beforeAll(async () => {
  console.log('🚀 Iniciando setup dos testes...');
  
  // Configurar banco de dados de teste
  await setupTestDatabase();
  
  // Configurar timezone para testes consistentes
  process.env.TZ = 'UTC';
  
  console.log('✅ Setup dos testes concluído');
});

// 🧹 Limpeza após todos os testes
afterAll(async () => {
  console.log('🧹 Iniciando limpeza dos testes...');
  
  // Limpar banco de dados de teste
  await cleanupTestDatabase();
  
  console.log('✅ Limpeza dos testes concluída');
});

// 🔄 Setup antes de cada teste
beforeEach(() => {
  // Limpar mocks entre testes
  vi.clearAllMocks();
  
  // Reset de localStorage e sessionStorage
  Object.defineProperty(window, 'localStorage', {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
    writable: true,
  });
  
  Object.defineProperty(window, 'sessionStorage', {
    value: {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    },
    writable: true,
  });
});

// 🧹 Limpeza após cada teste
afterEach(() => {
  // Limpar DOM após testes de componentes
  cleanup();
  
  // Reset de timers
  vi.useRealTimers();
});

// 🌐 Configurações globais do jsdom (para testes de componentes)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// 📋 Mock do clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined),
    readText: vi.fn().mockResolvedValue(''),
  },
  writable: true,
});

// 📁 Mock do File API
global.File = class File {
  constructor(chunks: any[], filename: string, opts: any = {}) {
    return {
      name: filename,
      size: chunks.reduce((acc, chunk) => acc + chunk.length, 0),
      type: opts.type || 'application/octet-stream',
      lastModified: Date.now(),
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
      slice: vi.fn(),
      stream: vi.fn(),
      text: vi.fn().mockResolvedValue('mock file content'),
    } as any;
  }
};

// 🎯 Mock do FormData
global.FormData = class FormData {
  private data = new Map();
  
  append(key: string, value: any) {
    this.data.set(key, value);
  }
  
  get(key: string) {
    return this.data.get(key);
  }
  
  has(key: string) {
    return this.data.has(key);
  }
  
  delete(key: string) {
    this.data.delete(key);
  }
  
  entries() {
    return this.data.entries();
  }
} as any;

// 🔗 Mock do fetch global
global.fetch = vi.fn();

// 📍 Mock do URL.createObjectURL
global.URL.createObjectURL = vi.fn(() => 'mocked-url');
global.URL.revokeObjectURL = vi.fn();

// 🎨 Suprimir warnings de CSS em testes
const originalConsoleWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is deprecated')
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

console.log('🧪 Test setup configurado com sucesso');