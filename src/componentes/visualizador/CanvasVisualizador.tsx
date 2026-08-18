/**
 * Componente Canvas interativo GIS para navegação, anotação e conferência.
 */
import React, { useRef, useEffect, useCallback } from 'react';
import { ProjetoLevantamento } from '../../tipos/levantamento';
import { DeteccaoEstrutura } from '../../tipos/deteccao';
import { PontoCoordenada } from '../../tipos/poligono';
import { ModoFerramenta } from '../../ganchos/useControleCanvas';
import { carregarElementoImagem } from '../../servicos/processamento-imagem-base';
import { renderizarCamadaMarcadores } from './RenderizadorMarcadores';
import { renderizarCamadaPoligono } from './RenderizadorPoligono';
import { EstadoCamadasVisiveis } from './ControleCamadas';
import { useEventosMouseCanvas } from '../../ganchos/useEventosMouseCanvas';

interface CanvasVisualizadorProps {
  projeto: ProjetoLevantamento;
  deteccoes: DeteccaoEstrutura[];
  estruturaSelecionada: DeteccaoEstrutura | null;
  aoSelecionarEstrutura: (estrutura: DeteccaoEstrutura | null) => void;
  aoAdicionarEstrutura: (x: number, y: number) => void;
  aoRemoverEstrutura: (id: string) => void;
  aoMoverEstrutura: (id: string, x: number, y: number) => void;
  modo: ModoFerramenta;
  zoom: number;
  pan: PontoCoordenada;
  converterTelaParaImagem: (x: number, y: number, rect: DOMRect) => PontoCoordenada;
  iniciarArrasto: (x: number, y: number) => void;
  moverArrasto: (x: number, y: number) => void;
  finalizarArrasto: () => void;
  camadas: EstadoCamadasVisiveis;
  pontosPoligonoTemp?: PontoCoordenada[];
  aoAdicionarPontoPoligono?: (ponto: PontoCoordenada) => void;
}

export const CanvasVisualizador: React.FC<CanvasVisualizadorProps> = ({
  projeto,
  deteccoes,
  estruturaSelecionada,
  aoSelecionarEstrutura,
  aoAdicionarEstrutura,
  aoRemoverEstrutura,
  aoMoverEstrutura,
  modo,
  zoom,
  pan,
  converterTelaParaImagem,
  iniciarArrasto,
  moverArrasto,
  finalizarArrasto,
  camadas,
  pontosPoligonoTemp,
  aoAdicionarPontoPoligono
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagemRef = useRef<HTMLImageElement | null>(null);

  const { idPairando, lidarMouseDown, lidarMouseMove, lidarMouseUp } = useEventosMouseCanvas({
    deteccoes,
    zoom,
    modo,
    exibirRemovidos: camadas.estruturasRemovidas,
    converterTelaParaImagem,
    iniciarArrasto,
    moverArrasto,
    finalizarArrasto,
    aoSelecionarEstrutura,
    aoAdicionarEstrutura,
    aoRemoverEstrutura,
    aoMoverEstrutura,
    aoAdicionarPontoPoligono
  });

  useEffect(() => {
    let ativo = true;
    carregarElementoImagem(projeto.imagem.urlOriginal).then((img) => {
      if (ativo) imagemRef.current = img;
    });
    return () => {
      ativo = false;
    };
  }, [projeto.imagem.urlOriginal]);

  const renderizarCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const largura = canvas.clientWidth;
    const altura = canvas.clientHeight;
    if (canvas.width !== largura * dpr || canvas.height !== altura * dpr) {
      canvas.width = largura * dpr;
      canvas.height = altura * dpr;
    }

    ctx.save();
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, largura, altura);
    ctx.fillStyle = '#0B132B';
    ctx.fillRect(0, 0, largura, altura);

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    if (camadas.imagemOriginal && imagemRef.current) {
      ctx.drawImage(imagemRef.current, 0, 0, projeto.imagem.largura, projeto.imagem.altura);
    }

    if (camadas.poligonoArea) {
      renderizarCamadaPoligono(ctx, {
        poligono: projeto.areaInteresse,
        pontosTemporarios: pontosPoligonoTemp,
        zoom,
        modoEdicao: modo === 'desenhar_poligono'
      });
    }

    renderizarCamadaMarcadores(ctx, {
      deteccoes: deteccoes.filter((d) => {
        if (!camadas.estruturasConfirmadas && d.status === 'confirmado') return false;
        if (!camadas.estruturasManuais && d.origem === 'manual') return false;
        if (!camadas.estruturasIncertas && (d.status === 'necessita_revisao' || d.status === 'revisao_borda')) return false;
        return true;
      }),
      zoom,
      idSelecionado: estruturaSelecionada?.id,
      idPairando,
      exibirRotulos: camadas.rotulosIdentificadores,
      exibirContornos: camadas.contornosCobertura,
      exibirRemovidos: camadas.estruturasRemovidas
    });

    ctx.restore();
    ctx.restore();
  }, [projeto, deteccoes, estruturaSelecionada, idPairando, zoom, pan, camadas, modo, pontosPoligonoTemp]);

  useEffect(() => {
    let animId: number;
    const loop = () => {
      renderizarCanvas();
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [renderizarCanvas]);

  return (
    <div className="container-canvas-gis">
      <canvas
        ref={canvasRef}
        className={`canvas-elemento modo-${modo}`}
        onMouseDown={(e) => lidarMouseDown(e, canvasRef.current)}
        onMouseMove={(e) => lidarMouseMove(e, canvasRef.current)}
        onMouseUp={lidarMouseUp}
        onMouseLeave={lidarMouseUp}
      />
    </div>
  );
};
