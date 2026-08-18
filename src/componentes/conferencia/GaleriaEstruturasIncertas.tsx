/**
 * Galeria de revisão rápida para estruturas com baixa confiança ou incerteza.
 */
import React from 'react';
import { Check, X, ArrowRight } from 'lucide-react';
import { DeteccaoEstrutura } from '../../tipos/deteccao';

interface GaleriaEstruturasIncertasProps {
  estruturasIncertas: DeteccaoEstrutura[];
  aoConfirmar: (id: string) => void;
  aoRemover: (id: string) => void;
  aoSelecionar: (estrutura: DeteccaoEstrutura) => void;
  aoIrParaProxima: () => void;
}

export const GaleriaEstruturasIncertas: React.FC<GaleriaEstruturasIncertasProps> = ({
  estruturasIncertas,
  aoConfirmar,
  aoRemover,
  aoSelecionar,
  aoIrParaProxima
}) => {
  if (estruturasIncertas.length === 0) {
    return (
      <div className="alerta-sem-pendencias">
        <div className="icone-ok">✓</div>
        <h4>Nenhuma pendência de baixa confiança!</h4>
        <p>Todas as coberturas foram validadas com sucesso.</p>
      </div>
    );
  }

  return (
    <div className="container-galeria-incertas">
      <div className="cabecalho-galeria">
        <div className="titulo-galeria">
          <span>Revisão Rápida de Incertezas</span>
          <span className="badge-contagem-incertas">{estruturasIncertas.length} pendentes</span>
        </div>
        <button
          type="button"
          className="btn-proxima-pendencia"
          onClick={aoIrParaProxima}
        >
          <span>Ir para próxima</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="grade-cards-incertas">
        {estruturasIncertas.slice(0, 12).map((est) => (
          <div key={est.id} className="card-incerta-item">
            <div
              className="topo-card-incerta"
              onClick={() => aoSelecionar(est)}
              title="Clique para inspecionar no mapa"
            >
              <strong className="codigo">{est.codigoIdentificador}</strong>
              <span className="porcentagem">{Math.round(est.confianca * 100)}%</span>
            </div>

            <div className="acoes-rapidas-incerta">
              <button
                type="button"
                className="btn-rapido confirmar"
                onClick={() => aoConfirmar(est.id)}
                title="É uma estrutura (Confirmar)"
              >
                <Check size={14} />
                <span>É estrutura</span>
              </button>
              <button
                type="button"
                className="btn-rapido rejeitar"
                onClick={() => aoRemover(est.id)}
                title="Não é estrutura (Remover)"
              >
                <X size={14} />
                <span>Não é</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
