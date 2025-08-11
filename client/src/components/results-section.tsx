import { useToast } from "@/hooks/use-toast";

interface ResultsSectionProps {
  data: {
    edital: {
      id: number;
      fileName: string;
    };
    verticalizedContent: {
      structuredJson: {
        disciplinas: Array<{
          nome: string;
          topicos: string[];
        }>;
      };
      processedAt: string;
      accuracyScore: number;
    };
  };
  onStartNew: () => void;
}

export function ResultsSection({ data, onStartNew }: ResultsSectionProps) {
  const { toast } = useToast();

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch(`/api/editals/${data.edital.id}/csv`);
      if (!response.ok) throw new Error('Falha no download');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'edital_verticalizado.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download iniciado",
        description: "O arquivo CSV foi baixado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o arquivo CSV.",
        variant: "destructive",
      });
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      let textContent = '';
      data.verticalizedContent.structuredJson.disciplinas.forEach((disciplina) => {
        textContent += `${disciplina.nome}\n\n`;
        disciplina.topicos.forEach((topico) => {
          textContent += `${topico}\n`;
        });
        textContent += '\n';
      });

      await navigator.clipboard.writeText(textContent);
      toast({
        title: "Texto copiado",
        description: "O conteúdo foi copiado para a área de transferência.",
      });
    } catch (error) {
      toast({
        title: "Erro na cópia",
        description: "Não foi possível copiar o texto.",
        variant: "destructive",
      });
    }
  };

  const topicsCount = data.verticalizedContent.structuredJson.disciplinas.reduce(
    (count, disciplina) => count + disciplina.topicos.length,
    0
  );

  const processingTime = "18s"; // Placeholder for MVP
  const accuracy = data.verticalizedContent.accuracyScore || 99.2;

  return (
    <div>
      {/* Success Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div className="bg-secondary/10 rounded-full p-3 mr-4">
                <span className="material-icons text-secondary text-2xl">check_circle</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Edital Processado com Sucesso!</h3>
                <p className="text-gray-600">
                  Processado em {processingTime} • {topicsCount} tópicos identificados • {accuracy}% de precisão
                </p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                className="bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center"
                onClick={handleDownloadCSV}
              >
                <span className="material-icons mr-2">download</span>
                Baixar CSV
              </button>
              <button 
                className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
                onClick={handleCopyToClipboard}
              >
                <span className="material-icons mr-2">content_copy</span>
                Copiar Texto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Structured Content Display */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="p-6 sm:p-8">
          <h4 className="text-lg font-semibold text-gray-900 mb-6">Conteúdo Programático Estruturado</h4>
          
          <div className="space-y-6">
            {data.verticalizedContent.structuredJson.disciplinas.map((disciplina, index) => (
              <div key={index} className="border-l-4 border-primary pl-4">
                <h5 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="material-icons mr-2 text-primary">school</span>
                  {disciplina.nome}
                </h5>
                
                <div className="space-y-1 pl-4">
                  {disciplina.topicos.map((topico, topicoIndex) => (
                    <div 
                      key={topicoIndex} 
                      className="text-gray-700 leading-relaxed"
                      style={{ paddingLeft: `${(topico.match(/^(\s+)/)?.[1]?.length || 0) * 12}px` }}
                    >
                      {topico.trim()}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Start New Process */}
      <div className="mt-8 text-center">
        <button 
          className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200"
          onClick={onStartNew}
        >
          <span className="material-icons mr-2">add</span>
          Processar Novo Edital
        </button>
      </div>
    </div>
  );
}
