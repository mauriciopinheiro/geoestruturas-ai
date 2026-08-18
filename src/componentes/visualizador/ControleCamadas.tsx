/**
 * Painel flutuante de controle de visibilidade das camadas no mapa.
 */
import React from 'react';
import { Layers, Eye, EyeOff } from 'lucide-react';

export interface EstadoCamadasVisiveis {
  imagemOriginal: boolean;
  poligonoArea: boolean;
  estruturasConfirmadas: boolean;
  estruturasManuais: boolean;
  estruturasIncertas: boolean;
  estruturasRemovidas: boolean;
  rotulosIdentificadores: boolean;
  contornosCobertura: boolean;
}

interface ControleCamadasProps {
  camadas: EstadoCamadasVisiveis;
  aoAlternarCamada: (chave: keyof EstadoCamadasVisiveis) => void;
  aberto: boolean;
  aoAlternarPainel: () => void;
}

export const ControleCamadas: React.FC<ControleCamadasProps> = ({
  camadas,
  aoAlternarCamada,
  aberto,
  aoAlternarPainel
}) => {
  return (
    <div className={`painel-camadas-gis ${aberto ? 'aberto' : 'fechado'}`}>
      <button
        type="button"
        className="btn-toggle-camadas"
        onClick={aoAlternarPainel}
        title="Gerenciar Camadas Visíveis"
      >
        <Layers size={18} />
        <span>Camadas</span>
      </button>

      {aberto && (
        <div className="conteudo-camadas-gis">
          <div className="titulo-camadas">
            <span>Camadas e Legenda</span>
          </div>

          <div className="lista-opcoes-camadas">
            <label className="item-opcao-camada">
              <input
                type="checkbox"
                checked={camadas.imagemOriginal}
                onChange={() => aoAlternarCamada('imagemOriginal')}
              />
              <span className="indicador-cor-camada cor-imagem" />
              <span>Imagem Aérea Base</span>
            </label>

            <label className="item-opcao-camada">
              <input
                type="checkbox"
                checked={camadas.poligonoArea}
                onChange={() => aoAlternarCamada('poligonoArea')}
              />
              <span className="indicador-cor-camada cor-poligono" />
              <span>Área de Interesse (AOI)</span>
            </label>

            <label className="item-opcao-camada">
              <input
                type="checkbox"
                checked={camadas.estruturasConfirmadas}
                onChange={() => aoAlternarCamada('estruturasConfirmadas')}
              />
              <span className="indicador-cor-camada cor-ia" />
              <span>Estruturas IA (Vermelho)</span>
            </label>

            <label className="item-opcao-camada">
              <input
                type="checkbox"
                checked={camadas.estruturasManuais}
                onChange={() => aoAlternarCamada('estruturasManuais')}
              />
              <span className="indicador-cor-camada cor-manual" />
              <span>Estruturas Manuais (Azul)</span>
            </label>

            <label className="item-opcao-camada">
              <input
                type="checkbox"
                checked={camadas.estruturasIncertas}
                onChange={() => aoAlternarCamada('estruturasIncertas')}
              />
              <span className="indicador-cor-camada cor-revisao" />
              <span>Baixa Confiança (Âmbar)</span>
            </label>

            <label className="item-opcao-camada">
              <input
                type="checkbox"
                checked={camadas.estruturasRemovidas}
                onChange={() => aoAlternarCamada('estruturasRemovidas')}
              />
              <span className="indicador-cor-camada cor-removido" />
              <span>Removidas / Falso Positivo</span>
            </label>

            <label className="item-opcao-camada">
              <input
                type="checkbox"
                checked={camadas.rotulosIdentificadores}
                onChange={() => aoAlternarCamada('rotulosIdentificadores')}
              />
              {camadas.rotulosIdentificadores ? <Eye size={14} /> : <EyeOff size={14} />}
              <span>Identificadores (IDs)</span>
            </label>

            <label className="item-opcao-camada">
              <input
                type="checkbox"
                checked={camadas.contornosCobertura}
                onChange={() => aoAlternarCamada('contornosCobertura')}
              />
              <span className="indicador-cor-camada cor-contorno" />
              <span>Contornos de Cobertura</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
