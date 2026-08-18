/**
 * Barra de ferramentas flutuante GIS para operações no Canvas.
 */
import React from 'react';
import {
  Hand,
  PlusCircle,
  Trash2,
  Move,
  Pentagon,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCcw,
  Undo2,
  Redo2
} from 'lucide-react';
import { ModoFerramenta } from '../../ganchos/useControleCanvas';

interface BarraFerramentasGISProps {
  modo: ModoFerramenta;
  aoMudarModo: (modo: ModoFerramenta) => void;
  aoZoomIn: () => void;
  aoZoomOut: () => void;
  aoResetarZoom: () => void;
  aoAlternarTelaCheia: () => void;
  podeDesfazer: boolean;
  podeRefazer: boolean;
  aoDesfazer: () => void;
  aoRefazer: () => void;
}

export const BarraFerramentasGIS: React.FC<BarraFerramentasGISProps> = ({
  modo,
  aoMudarModo,
  aoZoomIn,
  aoZoomOut,
  aoResetarZoom,
  aoAlternarTelaCheia,
  podeDesfazer,
  podeRefazer,
  aoDesfazer,
  aoRefazer
}) => {
  return (
    <div className="barra-ferramentas-gis" role="toolbar" aria-label="Ferramentas GIS">
      <div className="grupo-botoes-ferramenta">
        <button
          type="button"
          className={`btn-icone-gis ${modo === 'navegar' ? 'ativo' : ''}`}
          onClick={() => aoMudarModo('navegar')}
          title="Navegar e arrastar imagem (Espaço + Arrastar)"
        >
          <Hand size={18} />
          <span>Navegar</span>
        </button>

        <button
          type="button"
          className={`btn-icone-gis ${modo === 'adicionar' ? 'ativo' : ''}`}
          onClick={() => aoMudarModo('adicionar')}
          title="Adicionar estrutura manual (+)"
        >
          <PlusCircle size={18} />
          <span>Adicionar</span>
        </button>

        <button
          type="button"
          className={`btn-icone-gis ${modo === 'remover' ? 'ativo' : ''}`}
          onClick={() => aoMudarModo('remover')}
          title="Remover estrutura clicada"
        >
          <Trash2 size={18} />
          <span>Remover</span>
        </button>

        <button
          type="button"
          className={`btn-icone-gis ${modo === 'mover' ? 'ativo' : ''}`}
          onClick={() => aoMudarModo('mover')}
          title="Ajustar posição do centróide"
        >
          <Move size={18} />
          <span>Mover</span>
        </button>

        <button
          type="button"
          className={`btn-icone-gis ${modo === 'desenhar_poligono' ? 'ativo' : ''}`}
          onClick={() => aoMudarModo('desenhar_poligono')}
          title="Desenhar / Editar Área de Interesse (AOI)"
        >
          <Pentagon size={18} />
          <span>Polígono AOI</span>
        </button>
      </div>

      <div className="divisor-ferramentas" />

      <div className="grupo-botoes-ferramenta">
        <button
          type="button"
          className="btn-icone-gis"
          onClick={aoDesfazer}
          disabled={!podeDesfazer}
          title="Desfazer ação (Ctrl + Z)"
        >
          <Undo2 size={17} />
        </button>
        <button
          type="button"
          className="btn-icone-gis"
          onClick={aoRefazer}
          disabled={!podeRefazer}
          title="Refazer ação (Ctrl + Shift + Z)"
        >
          <Redo2 size={17} />
        </button>
      </div>

      <div className="divisor-ferramentas" />

      <div className="grupo-botoes-ferramenta">
        <button type="button" className="btn-icone-gis" onClick={aoZoomIn} title="Aproximar (+)">
          <ZoomIn size={18} />
        </button>
        <button type="button" className="btn-icone-gis" onClick={aoZoomOut} title="Afastar (-)">
          <ZoomOut size={18} />
        </button>
        <button
          type="button"
          className="btn-icone-gis"
          onClick={aoResetarZoom}
          title="Resetar enquadramento"
        >
          <RotateCcw size={17} />
        </button>
        <button
          type="button"
          className="btn-icone-gis"
          onClick={aoAlternarTelaCheia}
          title="Modo Tela Cheia"
        >
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
};
