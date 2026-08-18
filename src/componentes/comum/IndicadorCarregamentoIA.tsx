/**
 * Modal de processamento visual durante a execução da Visão Computacional.
 */
import React from 'react';
import { Cpu, CheckCircle2, Loader2 } from 'lucide-react';

interface IndicadorCarregamentoIAProps {
  etapaAtual: number;
  mensagemAtual: string;
  totalEtapas?: number;
}

export const IndicadorCarregamentoIA: React.FC<IndicadorCarregamentoIAProps> = ({
  etapaAtual,
  mensagemAtual,
  totalEtapas = 8
}) => {
  const etapasTexto = [
    'Preparando imagem e normalização',
    'Identificando área delimitada (AOI)',
    'Detectando coberturas e telhados',
    'Separando estruturas adjacentes',
    'Analisando estruturas de borda',
    'Calculando nível de confiança',
    'Gerando marcações de centróides',
    'Consolidando contagem final auditável'
  ];

  const porcentagem = Math.min(100, Math.round((etapaAtual / totalEtapas) * 100));

  return (
    <div className="overlay-processamento-ia" role="dialog" aria-modal="true">
      <div className="card-modal-processamento">
        <div className="topo-modal-ia">
          <div className="icone-pulsante-ia">
            <Cpu size={28} />
          </div>
          <div>
            <h3 className="titulo-modal-ia">Analisando Imagem por IA</h3>
            <p className="subtitulo-modal-ia">Identificando e individualizando coberturas...</p>
          </div>
        </div>

        <div className="barra-progresso-geral">
          <div className="trilho-barra">
            <div className="progresso-ia" style={{ width: `${porcentagem}%` }} />
          </div>
          <div className="texto-porcentagem-ia">{porcentagem}% Concluído</div>
        </div>

        <div className="lista-etapas-processamento">
          {etapasTexto.map((texto, idx) => {
            const numeroEtapa = idx + 1;
            const concluida = etapaAtual > numeroEtapa;
            const ativa = etapaAtual === numeroEtapa;

            return (
              <div
                key={texto}
                className={`item-etapa-ia ${concluida ? 'concluida' : ''} ${ativa ? 'ativa' : ''}`}
              >
                <div className="icone-status-etapa">
                  {concluida ? (
                    <CheckCircle2 size={16} className="icone-concluido" />
                  ) : ativa ? (
                    <Loader2 size={16} className="icone-girando" />
                  ) : (
                    <span className="ponto-pendente" />
                  )}
                </div>
                <span className="rotulo-etapa-texto">{texto}</span>
              </div>
            );
          })}
        </div>

        <div className="rodape-status-ia">
          <span className="mensagem-dinamica">{mensagemAtual}</span>
        </div>
      </div>
    </div>
  );
};
