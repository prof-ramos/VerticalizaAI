import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface UploadSectionProps {
  onProcessingStart: () => void;
  onProcessingComplete: (data: any) => void;
  onProcessingError: (error: string) => void;
}

export function UploadSection({ onProcessingStart, onProcessingComplete, onProcessingError }: UploadSectionProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const processMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('pdf', file);

      const response = await fetch('/api/editals/process', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha no processamento');
      }

      return response.json();
    },
    onSuccess: (data) => {
      onProcessingComplete(data);
    },
    onError: (error: Error) => {
      onProcessingError(error.message);
    },
  });

  const handleFileSelect = (file: File) => {
    // Validate file
    if (file.type !== 'application/pdf') {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, envie apenas arquivos PDF.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 20MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleProcess = () => {
    if (!selectedFile) return;
    
    onProcessingStart();
    processMutation.mutate(selectedFile);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-8">
      <div className="p-6 sm:p-8">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Faça o Upload do seu Edital</h3>
          <p className="text-gray-600">Formatos aceitos: PDF • Tamanho máximo: 20MB</p>
        </div>
        
        {/* Upload Area */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors duration-200 cursor-pointer"
          onClick={handleUploadClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="flex flex-col items-center">
            <span className="material-icons text-6xl text-gray-400 mb-4">cloud_upload</span>
            <p className="text-lg font-medium text-gray-700 mb-2">
              Arraste seu PDF aqui ou <span className="text-primary">clique para escolher</span>
            </p>
            <p className="text-sm text-gray-500">PDF de até 20MB</p>
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept=".pdf" 
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* File Info */}
        {selectedFile && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="material-icons text-primary">description</span>
                <div>
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-600">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={handleRemoveFile}
              >
                <span className="material-icons">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Process Button */}
        <div className="mt-6">
          <button 
            className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-800 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed" 
            disabled={!selectedFile || processMutation.isPending}
            onClick={handleProcess}
          >
            <span className="flex items-center justify-center">
              <span className="material-icons mr-2">psychology</span>
              {processMutation.isPending ? 'Processando...' : 'Processar com IA'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
