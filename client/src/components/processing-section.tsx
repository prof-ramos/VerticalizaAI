import { useState, useEffect } from "react";

export function ProcessingSection() {
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState('Extraindo texto do PDF...');

  useEffect(() => {
    const steps = [
      { progress: 20, step: 'Validando arquivo...' },
      { progress: 40, step: 'Extraindo texto do PDF...' },
      { progress: 70, step: 'Processando com IA...' },
      { progress: 90, step: 'Estruturando conteúdo...' },
      { progress: 100, step: 'Finalizando...' },
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      if (currentStepIndex < steps.length) {
        const currentStep = steps[currentStepIndex];
        setProgress(currentStep.progress);
        setStep(currentStep.step);
        currentStepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
      <div className="p-6 sm:p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <span className="material-icons text-primary text-3xl animate-spin">autorenew</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Processando seu Edital</h3>
          <p className="text-gray-600 mb-6">Nossa IA está analisando e estruturando o conteúdo...</p>
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600">
              <span>{step}</span>
              <span className="float-right">{progress}%</span>
            </p>
          </div>

          {/* Processing Steps */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <span className="material-icons text-secondary mr-3">check_circle</span>
                <span className="text-gray-700">Arquivo carregado</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="material-icons text-primary mr-3 animate-spin">autorenew</span>
                <span className="text-gray-700">Extraindo conteúdo</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="material-icons text-gray-400 mr-3">psychology</span>
                <span className="text-gray-400">Estruturando com IA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
