/**
 * Visualizador comparativo Antes/Depois com divisor interativo (Slider de Cortina).
 */
import React, { useState, useRef, useEffect } from 'react';
import { Download, Sliders, Columns, Eye } from 'lucide-react';
import { ProjetoLevantamento } from '../../tipos/levantamento';
import { gerarImagemMarcadaAltaResolucao } from '../../servicos/servico-exportacao';

interface ComparadorAntesDepoisProps {
  projeto: ProjetoLevantamento;
  aoFechar?: () => void;
}

type ModoVisualizacao = 'slider' | 'lado_a_lado' | 'apenas_original' | 'apenas_marcada';

export const ComparadorAntesDepois: React.FC<ComparadorAntesDepoisProps> = ({ projeto }) => {
  const [posicaoSlider, setPosicaoSlider] = useState(50); // % de corte
  const [modo, setModo] = useState<ModoVisualizacao>('slider');
  const [urlMarcada, setUrlMarcada] = useState<string | null>(null);
  const [incluirLegenda, setIncluirLegenda] = useState(true);
  const [gerando, setGerando] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let ativo = true;
    setGerando(true);
    gerarImagemMarcadaAltaResolucao(projeto, {
      incluirLegenda,
      incluirPoligono: true
    }).then((dataUrl) => {
      if (ativo) {
        setUrlMarcada(dataUrl);
        setGerando(false);
      }
    });
    return () => {
      ativo = false;
    };
  }, [projeto, incluirLegenda]);

  const lidarMovimentoSlider = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modo !== 'slider' || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setPosicaoSlider(Math.round((x / rect.width) * 100));
  };

  const baixarImagem = (tipo: 'original' | 'marcada') => {
    const link = document.createElement('a');
    link.download = `${projeto.codigoProjeto}_${tipo === 'original' ? 'original' : 'marcada'}.jpg`;
    link.href = tipo === 'original' ? projeto.imagem.urlOriginal : urlMarcada || '';
    link.click();
  };

  return (
    <div className="container-comparador-completo">
      <div className="barra-controles-comparador">
        <div className="grupo-modos-comparador">
          <button
            type="button"
            className={`btn-modo-comp ${modo === 'slider' ? 'ativo' : ''}`}
            onClick={() => setModo('slider')}
          >
            <Sliders size={16} />
            <span>Slider Interativo</span>
          </button>
          <button
            type="button"
            className={`btn-modo-comp ${modo === 'lado_a_lado' ? 'ativo' : ''}`}
            onClick={() => setModo('lado_a_lado')}
          >
            <Columns size={16} />
            <span>Lado a Lado</span>
          </button>
          <button
            type="button"
            className={`btn-modo-comp ${modo === 'apenas_original' ? 'ativo' : ''}`}
            onClick={() => setModo('apenas_original')}
          >
            <Eye size={16} />
            <span>Original Pura</span>
          </button>
          <button
            type="button"
            className={`btn-modo-comp ${modo === 'apenas_marcada' ? 'ativo' : ''}`}
            onClick={() => setModo('apenas_marcada')}
          >
            <Eye size={16} />
            <span>Marcada com IA</span>
          </button>
        </div>

        <div className="acoes-exportacao-comparador">
          <label className="checkbox-legenda-comp">
            <input
              type="checkbox"
              checked={incluirLegenda}
              onChange={(e) => setIncluirLegenda(e.target.checked)}
            />
            <span>Incluir Legenda Técnica</span>
          </label>
          <button
            type="button"
            className="btn-download-comp"
            onClick={() => baixarImagem('original')}
          >
            <Download size={15} />
            <span>Baixar Original</span>
          </button>
          <button
            type="button"
            className="btn-download-comp destaque"
            onClick={() => baixarImagem('marcada')}
            disabled={gerando || !urlMarcada}
          >
            <Download size={15} />
            <span>Baixar Marcada (Alta Res)</span>
          </button>
        </div>
      </div>

      <div className="area-visualizacao-comparador">
        {modo === 'slider' && (
          <div
            ref={containerRef}
            className="palco-slider-cortina"
            onMouseMove={lidarMovimentoSlider}
          >
            {/* Camada Direita / Inferior: Imagem Marcada */}
            <img
              src={urlMarcada || projeto.imagem.urlOriginal}
              alt="Imagem Marcada"
              className="imagem-camada-slider"
            />
            {/* Camada Esquerda / Superior: Imagem Original pura */}
            <div
              className="mascara-camada-original"
              style={{ width: `${posicaoSlider}%` }}
            >
              <img
                src={projeto.imagem.urlOriginal}
                alt="Imagem Original"
                className="imagem-camada-slider"
              />
            </div>
            {/* Linha divisora interativa */}
            <div
              className="divisor-slider-linha"
              style={{ left: `${posicaoSlider}%` }}
            >
              <div className="alca-divisor">
                <span>◀ ▶</span>
              </div>
            </div>
            <div className="etiqueta-lado original">Original</div>
            <div className="etiqueta-lado marcada">
              Marcada ({projeto.estatisticas.totalContabilizado} estruturas)
            </div>
          </div>
        )}

        {modo === 'lado_a_lado' && (
          <div className="palco-lado-a-lado">
            <div className="painel-lado">
              <div className="cabecalho-lado">Imagem Aérea Original</div>
              <img src={projeto.imagem.urlOriginal} alt="Original" />
            </div>
            <div className="painel-lado">
              <div className="cabecalho-lado">
                Imagem Analisada ({projeto.estatisticas.totalContabilizado} estruturas)
              </div>
              <img src={urlMarcada || projeto.imagem.urlOriginal} alt="Marcada" />
            </div>
          </div>
        )}

        {modo === 'apenas_original' && (
          <div className="palco-simples">
            <img src={projeto.imagem.urlOriginal} alt="Original" />
          </div>
        )}

        {modo === 'apenas_marcada' && (
          <div className="palco-simples">
            <img src={urlMarcada || projeto.imagem.urlOriginal} alt="Marcada" />
          </div>
        )}
      </div>
    </div>
  );
};
