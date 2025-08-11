export function HeroSection() {
  return (
    <div className="text-center mb-12">
      <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
        Automatize a Estruturação do seu Edital
      </h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
        Carregue seu PDF do edital e receba em minutos uma versão verticalizada completa, 
        pronta para seu planejamento de estudos.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <span className="material-icons text-secondary">check_circle</span>
          <span>99%+ de precisão</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="material-icons text-secondary">schedule</span>
          <span>Economia de horas</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="material-icons text-secondary">download</span>
          <span>Exportação CSV/Texto</span>
        </div>
      </div>
    </div>
  );
}
