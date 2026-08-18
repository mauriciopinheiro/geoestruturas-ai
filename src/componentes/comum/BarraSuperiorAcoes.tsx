/**
 * Barra de navegação por etapas do fluxo de levantamento.
 */
import React from 'react';
import { Image, Pentagon, Cpu, CheckSquare, Award } from 'lucide-react';
import { EtapaFluxo } from '../../tipos/levantamento';

interface BarraSuperiorAcoesProps {
  etapaAtiva: EtapaFluxo;
  aoMudarEtapa: (etapa: EtapaFluxo) => void;
  aoExecutarAnaliseIA: () => void;
  processandoIA: boolean;
}

export const BarraSuperiorAcoes: React.FC<BarraSuperiorAcoesProps> = ({
  etapaAtiva,
  aoMudarEtapa,
  aoExecutarAnaliseIA,
  processandoIA
}) => {
  const etapas: Array<{ id: EtapaFluxo; rotulo: string; icone: React.ReactNode }> = [
    { id: 'imagem', rotulo: '1. Imagem', icone: <Image size={15} /> },
    { id: 'area_interesse', rotulo: '2. Área de Interesse', icone: <Pentagon size={15} /> },
    { id: 'analise_ia', rotulo: '3. Análise IA', icone: <Cpu size={15} /> },
    { id: 'conferencia', rotulo: '4. Conferência', icone: <CheckSquare size={15} /> },
    { id: 'resultado', rotulo: '5. Resultado', icone: <Award size={15} /> }
  ];

  return (
    <nav className="barra-etapas-fluxo" aria-label="Etapas do Processo">
      <div className="trilha-passos">
        {etapas.map((etapa) => {
          const ativa = etapaAtiva === etapa.id;
          return (
            <button
              key={etapa.id}
              type="button"
              className={`passo-item ${ativa ? 'ativo' : ''}`}
              onClick={() => aoMudarEtapa(etapa.id)}
            >
              <span className="icone-passo">{etapa.icone}</span>
              <span className="texto-passo">{etapa.rotulo}</span>
            </button>
          );
        })}
      </div>

      <div className="acoes-rapidas-barra">
        <button
          type="button"
          className="btn-executar-ia-destaque"
          onClick={aoExecutarAnaliseIA}
          disabled={processandoIA}
        >
          <Cpu size={16} />
          <span>{processandoIA ? 'Analisando Imagem...' : 'Executar Análise por IA'}</span>
        </button>
      </div>
    </nav>
  );
};
