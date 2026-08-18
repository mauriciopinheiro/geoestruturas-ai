/**
 * Tabela detalhada de métricas da contagem e composição das detecções.
 */
import React from 'react';
import { EstatisticasLevantamento } from '../../tipos/estatisticas';

interface TabelaMetricasProps {
  estatisticas: EstatisticasLevantamento;
}

export const TabelaMetricas: React.FC<TabelaMetricasProps> = ({ estatisticas }) => {
  return (
    <div className="container-tabela-metricas">
      <div className="titulo-secao-metricas">Composição da Contagem</div>

      <div className="lista-linhas-metricas">
        <div className="linha-metrica-item">
          <span className="rotulo-com-bolinha">
            <span className="ponto-legenda ponto-ia" />
            Detectados por IA
          </span>
          <strong className="valor-item">{estatisticas.detectadosIA}</strong>
        </div>

        <div className="linha-metrica-item">
          <span className="rotulo-com-bolinha">
            <span className="ponto-legenda ponto-confirmado" />
            Confirmados
          </span>
          <strong className="valor-item">{estatisticas.confirmadosIA}</strong>
        </div>

        <div className="linha-metrica-item">
          <span className="rotulo-com-bolinha">
            <span className="ponto-legenda ponto-revisao" />
            Necessitam Revisão
          </span>
          <strong className="valor-item alerta">{estatisticas.necessitamRevisao}</strong>
        </div>

        <div className="linha-metrica-item">
          <span className="rotulo-com-bolinha">
            <span className="ponto-legenda ponto-manual" />
            Adicionados Manualmente
          </span>
          <strong className="valor-item">{estatisticas.adicionadosManualmente}</strong>
        </div>

        <div className="linha-metrica-item">
          <span className="rotulo-com-bolinha">
            <span className="ponto-legenda ponto-removido" />
            Removidos / Falsos Positivos
          </span>
          <strong className="valor-item">{estatisticas.removidosManualmente}</strong>
        </div>
      </div>

      <div className="divisor-secao-metricas" />

      <div className="titulo-secao-metricas">Distribuição de Confiança</div>
      <div className="barras-distribuicao-confianca">
        <div className="linha-barra-conf">
          <div className="topo-barra">
            <span>Alta (&ge; 80%)</span>
            <strong>{estatisticas.altaConfianca}</strong>
          </div>
          <div className="trilho-progresso">
            <div
              className="preenchimento alta"
              style={{
                width: `${Math.round((estatisticas.altaConfianca / (estatisticas.detectadosIA || 1)) * 100)}%`
              }}
            />
          </div>
        </div>

        <div className="linha-barra-conf">
          <div className="topo-barra">
            <span>Média (65% - 79%)</span>
            <strong>{estatisticas.mediaConfianca}</strong>
          </div>
          <div className="trilho-progresso">
            <div
              className="preenchimento media"
              style={{
                width: `${Math.round((estatisticas.mediaConfianca / (estatisticas.detectadosIA || 1)) * 100)}%`
              }}
            />
          </div>
        </div>

        <div className="linha-barra-conf">
          <div className="topo-barra">
            <span>Baixa (&lt; 65%)</span>
            <strong>{estatisticas.baixaConfianca}</strong>
          </div>
          <div className="trilho-progresso">
            <div
              className="preenchimento baixa"
              style={{
                width: `${Math.round((estatisticas.baixaConfianca / (estatisticas.detectadosIA || 1)) * 100)}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
