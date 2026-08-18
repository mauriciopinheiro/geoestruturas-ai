/**
 * Card de exibição de um Levantamento Territorial no Dashboard.
 */
import React from 'react';
import { Building2, Calendar, MapPin, CheckCircle, Trash2, ArrowRight } from 'lucide-react';
import { ProjetoLevantamento } from '../../tipos/levantamento';

interface CardLevantamentoProps {
  projeto: ProjetoLevantamento;
  aoAbrir: (id: string) => void;
  aoExcluir: (id: string) => void;
}

export const CardLevantamento: React.FC<CardLevantamentoProps> = ({
  projeto,
  aoAbrir,
  aoExcluir
}) => {
  return (
    <div className="card-levantamento-item">
      <div className="container-thumbnail-levantamento" onClick={() => aoAbrir(projeto.id)}>
        <img
          src={projeto.imagem.urlOriginal}
          alt={projeto.nomeProjeto}
          className="imagem-miniatura-projeto"
        />
        <div className={`tag-status-projeto status-${projeto.status}`}>
          {projeto.status === 'concluido'
            ? 'Concluído'
            : projeto.status === 'em_conferencia'
            ? 'Em Conferência'
            : 'Novo'}
        </div>
      </div>

      <div className="corpo-card-levantamento">
        <div className="cabecalho-card-info">
          <span className="codigo-projeto-mini">{projeto.codigoProjeto}</span>
          <h3 className="titulo-projeto" onClick={() => aoAbrir(projeto.id)}>
            {projeto.nomeProjeto}
          </h3>
        </div>

        <div className="detalhes-localizacao">
          <div className="item-meta">
            <MapPin size={14} className="icone-meta" />
            <span>
              {projeto.nomeComunidade} — {projeto.municipio}/{projeto.unidadeFederativa}
            </span>
          </div>
          <div className="item-meta">
            <Calendar size={14} className="icone-meta" />
            <span>{projeto.dataLevantamento}</span>
          </div>
        </div>

        <div className="resumo-contagem-card">
          <div className="bloco-numero-card">
            <Building2 size={16} className="icone-barraco" />
            <span className="valor-barracos">
              {projeto.estatisticas.totalContabilizado}
            </span>
            <span className="rotulo-barracos">estruturas</span>
          </div>

          <div className="bloco-revisao-card">
            <CheckCircle size={14} className="icone-revisado" />
            <span>Revisão: {projeto.estatisticas.percentualRevisado}%</span>
          </div>
        </div>
      </div>

      <div className="rodape-card-levantamento">
        <button
          type="button"
          className="btn-excluir-projeto"
          onClick={() => aoExcluir(projeto.id)}
          title="Excluir Levantamento"
        >
          <Trash2 size={15} />
        </button>

        <button
          type="button"
          className="btn-abrir-projeto"
          onClick={() => aoAbrir(projeto.id)}
        >
          <span>Abrir Bancada GIS</span>
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
