// 🌍 Setup global para toda a suíte de testes

import { GlobalSetupContext } from 'vitest/node';

export default async function globalSetup({ provide }: GlobalSetupContext) {
  console.log('🚀 Iniciando setup global dos testes...');
  
  // Configurar variáveis de ambiente para testes
  process.env.NODE_ENV = 'test';
  process.env.GEMINI_API_KEY = 'test-mock-key';
  
  // Configurar timezone para testes consistentes
  process.env.TZ = 'UTC';
  
  // Desabilitar logs verbosos durante testes
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  
  if (process.env.VITEST_LOG_LEVEL !== 'verbose') {
    console.log = (...args: any[]) => {
      const message = args[0];
      if (typeof message === 'string' && 
          (message.includes('Starting Gemini processing') || 
           message.includes('Gemini response received'))) {
        return; // Suprimir logs verbosos do Gemini
      }
      originalConsoleLog(...args);
    };
    
    console.error = (...args: any[]) => {
      const message = args[0];
      if (typeof message === 'string' && 
          message.includes('Warning: ')) {
        return; // Suprimir warnings durante testes
      }
      originalConsoleError(...args);
    };
  }
  
  // Fornecer utilitários para os testes
  provide('originalConsole', {
    log: originalConsoleLog,
    error: originalConsoleError
  });
  
  console.log('✅ Setup global concluído');
  
  // Função de cleanup que será executada no final
  return async () => {
    console.log('🧹 Executando cleanup global...');
    
    // Restaurar console original
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
    
    console.log('✅ Cleanup global concluído');
  };
}