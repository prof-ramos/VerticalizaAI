import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    // 🔧 Configuração do ambiente de teste
    environment: 'node',
    
    // 📁 Padrões de arquivos de teste
    include: [
      'test/**/*.{test,spec}.{js,ts,tsx}',
      'src/**/*.{test,spec}.{js,ts,tsx}'
    ],
    
    // 🚫 Arquivos a ignorar
    exclude: [
      'node_modules/**',
      'dist/**',
      'coverage/**',
      '.replit/**'
    ],
    
    // ⚡ Performance e timeouts
    testTimeout: 30000,
    hookTimeout: 10000,
    teardownTimeout: 5000,
    
    // 📊 Configuração de cobertura
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/**',
        'test/**',
        'dist/**',
        '**/*.d.ts',
        '**/*.test.{js,ts,tsx}',
        '**/*.spec.{js,ts,tsx}',
        'vitest.config.ts',
        'vite.config.ts',
        'drizzle.config.ts',
        'tailwind.config.ts',
        'postcss.config.js',
        'client/src/components/ui/**', // Componentes shadcn
      ],
      thresholds: {
        global: {
          statements: 80,
          branches: 75,
          functions: 85,
          lines: 80
        }
      }
    },
    
    // 🔧 Setup e teardown globais
    globalSetup: './test/setup/global-setup.ts',
    setupFiles: ['./test/setup/test-setup.ts'],
    
    // 📝 Reporters
    reporter: ['verbose', 'html'],
    outputFile: {
      html: './coverage/test-results.html'
    },
    
    // 🌍 Variáveis de ambiente para testes
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/verticaliza_ai_test',
      GEMINI_API_KEY: 'test-key-mock'
    }
  },
  
  // 🔗 Resolução de paths (igual ao vite principal)
  resolve: {
    alias: {
      '@': resolve(__dirname, './client/src'),
      '@shared': resolve(__dirname, './shared'),
      '@server': resolve(__dirname, './server'),
      '@test': resolve(__dirname, './test')
    }
  },
  
  // 🎯 Definições para compatibilidade
  define: {
    'import.meta.vitest': 'undefined'
  }
});