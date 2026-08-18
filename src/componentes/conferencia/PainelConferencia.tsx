/**
 * Painel lateral de conferência técnica e revisão das estruturas detectadas.
 */
import React, { useState } from 'react';
import { Filter, Check, X, Eye } from 'lucide-react';
import { DeteccaoEstrutura, StatusDeteccao } from '../../tipos/deteccao';
import { GaleriaEstruturasIncertas } from './GaleriaEstruturasIncertas';
import { HistoricoAuditoria } from './HistoricoAuditoria';
import { RegistroAuditoria } from '../../tipos/estatisticas';

interface PainelConferenciaProps {
  deteccoes: DeteccaoEstrutura[];
  estruturaSelecionada: DeteccaoEstrutura | null;
  aoSelecionarEstrutura: (estrutura: DeteccaoEstrutura | null) => void;
  aoConfirmar: (id: string) => void;
  aoRemover: (id: string) => void;
  aoCentralizar?: (x: number, y: number) => void;
  registrosAuditoria: RegistroAuditoria[];
}

export const PainelConferencia: React.FC<PainelConferenciaProps> = ({
  deteccoes,
  estruturaSelecionada,
  aoSelecionarEstrutura,
  aoConfirmar,
  aoRemover,
  aoCentralizar,
  registrosAuditoria
}) => {
  const [filtroStatus, setFiltroStatus] = useState<StatusDeteccao | 'todos'>('todos');
  const [abaAtiva, setAbaAtiva] = useState<'lista' | 'galeria' | 'auditoria'>('lista');

  const incertas = deteccoes.filter(
    (d) => d.status === 'necessita_revisao' || d.status === 'revisao_borda'
  );

  const filtradas = deteccoes.filter((d) => {
    if (filtroStatus === 'todos') return true;
    return d.status === filtroStatus;
  });

  const irParaProximaIncerteza = () => {
    if (incertas.length > 0) {
      const prox = incertas[0];
      aoSelecionarEstrutura(prox);
      if (aoCentralizar) aoCentralizar(prox.x, prox.y);
    }
  };

  return (
    <div className="painel-conferencia-lateral">
      <div className="navegacao-abas-conferencia">
        <button
          type="button"
          className={`btn-aba-conf ${abaAtiva === 'lista' ? 'ativa' : ''}`}
          onClick={() => setAbaAtiva('lista')}
        >
          Estruturas ({deteccoes.length})
        </button>
        <button
          type="button"
          className={`btn-aba-conf ${abaAtiva === 'galeria' ? 'ativa' : ''}`}
          onClick={() => setAbaAtiva('galeria')}
        >
          Incertezas ({incertas.length})
        </button>
        <button
          type="button"
          className={`btn-aba-conf ${abaAtiva === 'auditoria' ? 'ativa' : ''}`}
          onClick={() => setAbaAtiva('auditoria')}
        >
          Auditoria
        </button>
      </div>

      {abaAtiva === 'galeria' && (
        <GaleriaEstruturasIncertas
          estruturasIncertas={incertas}
          aoConfirmar={aoConfirmar}
          aoRemover={aoRemover}
          aoSelecionar={(est) => {
            aoSelecionarEstrutura(est);
            if (aoCentralizar) aoCentralizar(est.x, est.y);
          }}
          aoIrParaProxima={irParaProximaIncerteza}
        />
      )}

      {abaAtiva === 'auditoria' && <HistoricoAuditoria registros={registrosAuditoria} />}

      {abaAtiva === 'lista' && (
        <div className="conteudo-lista-estruturas">
          <div className="barra-filtro-rapido">
            <Filter size={14} />
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value as StatusDeteccao | 'todos')}
              className="select-filtro-status"
            >
              <option value="todos">Todos os Status ({deteccoes.length})</option>
              <option value="confirmado">Confirmadas</option>
              <option value="necessita_revisao">Necessita Revisão</option>
              <option value="manual">Adição Manual</option>
              <option value="rejeitado">Removidas</option>
            </select>
          </div>

          <div className="lista-rolavel-estruturas">
            {filtradas.map((d) => {
              const selecionado = estruturaSelecionada?.id === d.id;
              return (
                <div
                  key={d.id}
                  className={`item-estrutura-linha ${selecionado ? 'selecionado' : ''} status-${d.status}`}
                  onClick={() => {
                    aoSelecionarEstrutura(d);
                    if (aoCentralizar) aoCentralizar(d.x, d.y);
                  }}
                >
                  <div className="coluna-info-item">
                    <strong className="codigo-tag">{d.codigoIdentificador}</strong>
                    <span className="origem-texto">
                      {d.origem === 'ia' ? `${Math.round(d.confianca * 100)}% IA` : 'Manual'}
                    </span>
                  </div>

                  <div className="coluna-acoes-item">
                    {d.status !== 'confirmado' && (
                      <button
                        type="button"
                        className="btn-mini-acao ok"
                        onClick={(e) => {
                          e.stopPropagation();
                          aoConfirmar(d.id);
                        }}
                        title="Confirmar"
                      >
                        <Check size={13} />
                      </button>
                    )}
                    {d.status !== 'rejeitado' && (
                      <button
                        type="button"
                        className="btn-mini-acao delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          aoRemover(d.id);
                        }}
                        title="Remover"
                      >
                        <X size={13} />
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-mini-acao ver"
                      onClick={(e) => {
                        e.stopPropagation();
                        aoSelecionarEstrutura(d);
                        if (aoCentralizar) aoCentralizar(d.x, d.y);
                      }}
                      title="Centralizar no Mapa"
                    >
                      <Eye size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
