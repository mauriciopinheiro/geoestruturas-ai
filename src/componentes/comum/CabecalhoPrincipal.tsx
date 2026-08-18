/**
 * Cabeçalho principal da aplicação com logotipo oficial Semae e controles globais.
 */
import React from 'react';
import { Plus, HelpCircle, Save, ArrowLeft } from 'lucide-react';
import { ProjetoLevantamento } from '../../tipos/levantamento';

interface CabecalhoPrincipalProps {
  projetoAtivo?: ProjetoLevantamento | null;
  aoVoltarParaDashboard?: () => void;
  aoAbrirNovoLevantamento: () => void;
  aoAbrirAjuda: () => void;
}

export const CabecalhoPrincipal: React.FC<CabecalhoPrincipalProps> = ({
  projetoAtivo,
  aoVoltarParaDashboard,
  aoAbrirNovoLevantamento,
  aoAbrirAjuda
}) => {
  return (
    <header className="cabecalho-sistema" role="banner">
      <div className="lado-esquerdo-cabecalho">
        {aoVoltarParaDashboard && (
          <button
            type="button"
            className="btn-voltar-dash"
            onClick={aoVoltarParaDashboard}
            title="Voltar aos Levantamentos"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <div className="bloco-marca-semae">
          <img
            src="/assets/Logo_completo.png"
            alt="SEMAE Piracicaba"
            className="logo-oficial-semae"
          />
          <div className="separador-marca" />
          <div className="titulos-sistema">
            <h1 className="nome-aplicacao">GeoEstruturas AI</h1>
            <span className="subtitulo-aplicacao">
              Análise e Levantamento de Edificações por Imagem Aérea
            </span>
          </div>
        </div>
      </div>

      {projetoAtivo && (
        <div className="centro-cabecalho-projeto">
          <span className="badge-codigo-projeto">{projetoAtivo.codigoProjeto}</span>
          <span className="nome-comunidade-cabecalho">
            {projetoAtivo.nomeComunidade} — {projetoAtivo.municipio}/{projetoAtivo.unidadeFederativa}
          </span>
          <div className="indicador-salvamento" title="Todas as alterações são salvas localmente">
            <Save size={14} className="icone-salvo" />
            <span>Salvo automaticamente</span>
          </div>
        </div>
      )}

      <div className="lado-direito-cabecalho">
        <button
          type="button"
          className="btn-novo-levantamento-topo"
          onClick={aoAbrirNovoLevantamento}
        >
          <Plus size={16} />
          <span>Novo Levantamento</span>
        </button>

        <button
          type="button"
          className="btn-icone-ajuda"
          onClick={aoAbrirAjuda}
          title="Ajuda e Metodologia"
        >
          <HelpCircle size={19} />
        </button>
      </div>
    </header>
  );
};
