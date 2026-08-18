/**
 * Filtros e busca de projetos de levantamento no Dashboard.
 */
import React from 'react';
import { Search } from 'lucide-react';
import { StatusLevantamento } from '../../tipos/levantamento';

interface FiltroProjetosProps {
  termoBusca: string;
  aoMudarBusca: (termo: string) => void;
  filtroStatus: StatusLevantamento | 'todos';
  aoMudarStatus: (status: StatusLevantamento | 'todos') => void;
  totalProjetos: number;
}

export const FiltroProjetos: React.FC<FiltroProjetosProps> = ({
  termoBusca,
  aoMudarBusca,
  filtroStatus,
  aoMudarStatus,
  totalProjetos
}) => {
  return (
    <div className="barra-filtros-dashboard">
      <div className="campo-busca-projetos">
        <Search size={17} className="icone-lupa" />
        <input
          type="text"
          placeholder="Buscar por comunidade, município ou código do projeto..."
          value={termoBusca}
          onChange={(e) => aoMudarBusca(e.target.value)}
          className="input-busca-geral"
        />
      </div>

      <div className="botoes-filtro-status">
        <button
          type="button"
          className={`btn-filtro-tab ${filtroStatus === 'todos' ? 'ativo' : ''}`}
          onClick={() => aoMudarStatus('todos')}
        >
          Todos ({totalProjetos})
        </button>
        <button
          type="button"
          className={`btn-filtro-tab ${filtroStatus === 'concluido' ? 'ativo' : ''}`}
          onClick={() => aoMudarStatus('concluido')}
        >
          Concluídos
        </button>
        <button
          type="button"
          className={`btn-filtro-tab ${filtroStatus === 'em_conferencia' ? 'ativo' : ''}`}
          onClick={() => aoMudarStatus('em_conferencia')}
        >
          Em Conferência
        </button>
      </div>
    </div>
  );
};
