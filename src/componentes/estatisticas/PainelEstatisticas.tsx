/**
 * Painel lateral direito com consolidação estatística, métricas e exportações.
 */
import React from 'react';
import { FileText, Download, AlertTriangle } from 'lucide-react';
import { ProjetoLevantamento } from '../../tipos/levantamento';
import { CardContadorPrincipal } from './CardContadorPrincipal';
import { TabelaMetricas } from './TabelaMetricas';
import { imprimirRelatorioTecnico } from '../../servicos/servico-relatorio-pdf';
import { exportarCSV, exportarGeoJSON } from '../../servicos/servico-exportacao';

interface PainelEstatisticasProps {
  projeto: ProjetoLevantamento;
  aoConcluirLevantamento?: () => void;
}

export const PainelEstatisticas: React.FC<PainelEstatisticasProps> = ({
  projeto,
  aoConcluirLevantamento
}) => {
  const baixarArquivo = (conteudo: string, nomeArquivo: string, mime: string) => {
    const blob = new Blob([conteudo], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportarComoCSV = () => {
    const csv = exportarCSV(projeto);
    baixarArquivo(csv, `${projeto.codigoProjeto}_estruturas.csv`, 'text/csv;charset=utf-8;');
  };

  const exportarComoGeoJSON = () => {
    const geo = exportarGeoJSON(projeto);
    baixarArquivo(geo, `${projeto.codigoProjeto}_pontos.geojson`, 'application/geo+json');
  };

  return (
    <div className="painel-estatisticas-lateral">
      <CardContadorPrincipal
        totalContabilizado={projeto.estatisticas.totalContabilizado}
        confiancaMedia={projeto.estatisticas.confiancaMediaGeral}
        percentualRevisado={projeto.estatisticas.percentualRevisado}
      />

      {projeto.estatisticas.necessitamRevisao > 0 && (
        <div className="alerta-pendencias-estatistica">
          <AlertTriangle size={16} />
          <div>
            <strong>Atenção:</strong> Existem {projeto.estatisticas.necessitamRevisao} estruturas
            com baixa confiança pendentes de conferência.
          </div>
        </div>
      )}

      <TabelaMetricas estatisticas={projeto.estatisticas} />

      <div className="secao-exportacoes-painel">
        <div className="titulo-secao-metricas">Exportação Técnica</div>

        <div className="grade-botoes-exportacao">
          <button
            type="button"
            className="btn-export-painel relatorio"
            onClick={() => imprimirRelatorioTecnico(projeto)}
          >
            <FileText size={15} />
            <span>Gerar Laudo PDF</span>
          </button>

          <button
            type="button"
            className="btn-export-painel"
            onClick={exportarComoCSV}
          >
            <Download size={14} />
            <span>Tabela CSV</span>
          </button>

          <button
            type="button"
            className="btn-export-painel"
            onClick={exportarComoGeoJSON}
          >
            <Download size={14} />
            <span>GeoJSON (GIS)</span>
          </button>
        </div>

        {aoConcluirLevantamento && projeto.status !== 'concluido' && (
          <button
            type="button"
            className="btn-concluir-levantamento"
            onClick={aoConcluirLevantamento}
          >
            Concluir e Homologar Levantamento
          </button>
        )}
      </div>
    </div>
  );
};
