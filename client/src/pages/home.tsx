import { useState } from "react";
import { HeroSection } from "@/components/hero-section";
import { UploadSection } from "@/components/upload-section";
import { ProcessingSection } from "@/components/processing-section";
import { ResultsSection } from "@/components/results-section";

type AppState = 'upload' | 'processing' | 'results' | 'error';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [processedData, setProcessedData] = useState<any>(null);
  const [error, setError] = useState<string>('');

  const handleProcessingStart = () => {
    setAppState('processing');
  };

  const handleProcessingComplete = (data: any) => {
    setProcessedData(data);
    setAppState('results');
  };

  const handleProcessingError = (errorMessage: string) => {
    setError(errorMessage);
    setAppState('error');
  };

  const handleStartNew = () => {
    setAppState('upload');
    setProcessedData(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-primary rounded-lg p-2">
                <span className="material-icons text-white text-2xl">auto_stories</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Verticaliza-AI</h1>
                <p className="text-sm text-gray-600">Estruture seu edital em minutos</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <span className="material-icons text-base">timer</span>
              <span>Processamento &lt; 30s</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <HeroSection />
        
        {appState === 'upload' && (
          <UploadSection 
            onProcessingStart={handleProcessingStart}
            onProcessingComplete={handleProcessingComplete}
            onProcessingError={handleProcessingError}
          />
        )}
        
        {appState === 'processing' && <ProcessingSection />}
        
        {appState === 'results' && processedData && (
          <ResultsSection 
            data={processedData} 
            onStartNew={handleStartNew}
          />
        )}
        
        {appState === 'error' && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 sm:p-8 text-center">
              <div className="bg-error/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="material-icons text-red-600 text-3xl">error</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Erro no Processamento</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors duration-200"
                onClick={handleStartNew}
              >
                <span className="material-icons mr-2">refresh</span>
                Tentar Novamente
              </button>
            </div>
          </div>
        )}

        {/* Features Info */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="bg-primary/10 rounded-lg p-3 w-fit mb-4">
              <span className="material-icons text-primary">speed</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Processamento Rápido</h4>
            <p className="text-gray-600 text-sm">Processamento em menos de 30 segundos usando IA avançada do Google Gemini.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="bg-secondary/10 rounded-lg p-3 w-fit mb-4">
              <span className="material-icons text-secondary">precision_manufacturing</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Alta Precisão</h4>
            <p className="text-gray-600 text-sm">Mais de 99% de precisão na extração, testado com editais de todas as grandes bancas.</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="bg-accent/10 rounded-lg p-3 w-fit mb-4">
              <span className="material-icons text-accent">file_download</span>
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Múltiplas Exportações</h4>
            <p className="text-gray-600 text-sm">Baixe em CSV para planilhas ou copie o texto para Notion, Anki e outras ferramentas.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-primary rounded-lg p-2">
                <span className="material-icons text-white">auto_stories</span>
              </div>
              <span className="text-xl font-bold">Verticaliza-AI</span>
            </div>
            <p className="text-gray-400 mb-6">Automatizando a estruturação de editais para concurseiros brasileiros</p>
            <div className="border-t border-gray-800 pt-6">
              <p className="text-gray-500 text-sm">© 2024 Verticaliza-AI. Todos os direitos reservados.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
