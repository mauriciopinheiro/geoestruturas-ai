/**
 * Gancho para controle de navegação, zoom, pan e transformações no Canvas GIS.
 */
import { useState, useCallback, useRef } from 'react';
import { PontoCoordenada } from '../tipos/poligono';

export type ModoFerramenta = 'navegar' | 'adicionar' | 'remover' | 'mover' | 'desenhar_poligono';

export function useControleCanvas() {
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState<PontoCoordenada>({ x: 0, y: 0 });
  const [modo, setModo] = useState<ModoFerramenta>('navegar');
  const [arrastando, setArrastando] = useState(false);
  const pontoInicioArrasto = useRef<PontoCoordenada>({ x: 0, y: 0 });

  const aplicarZoom = useCallback((fator: number, pontoCentro?: PontoCoordenada) => {
    setZoom((zAtual) => {
      const novoZoom = Math.min(8.0, Math.max(0.2, zAtual * fator));
      if (pontoCentro) {
        setPan((pAtual) => ({
          x: pontoCentro.x - (pontoCentro.x - pAtual.x) * (novoZoom / zAtual),
          y: pontoCentro.y - (pontoCentro.y - pAtual.y) * (novoZoom / zAtual)
        }));
      }
      return novoZoom;
    });
  }, []);

  const resetarVisualizacao = useCallback(() => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  }, []);

  const converterTelaParaImagem = useCallback(
    (xTela: number, yTela: number, rectCanvas: DOMRect): PontoCoordenada => {
      const relX = xTela - rectCanvas.left;
      const relY = yTela - rectCanvas.top;
      return {
        x: (relX - pan.x) / zoom,
        y: (relY - pan.y) / zoom
      };
    },
    [pan, zoom]
  );

  const converterImagemParaTela = useCallback(
    (xImg: number, yImg: number): PontoCoordenada => {
      return {
        x: xImg * zoom + pan.x,
        y: yImg * zoom + pan.y
      };
    },
    [pan, zoom]
  );

  const iniciarArrasto = useCallback((x: number, y: number) => {
    setArrastando(true);
    pontoInicioArrasto.current = { x, y };
  }, []);

  const moverArrasto = useCallback(
    (x: number, y: number) => {
      if (!arrastando) return;
      const dx = x - pontoInicioArrasto.current.x;
      const dy = y - pontoInicioArrasto.current.y;
      pontoInicioArrasto.current = { x, y };
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
    },
    [arrastando]
  );

  const finalizarArrasto = useCallback(() => {
    setArrastando(false);
  }, []);

  return {
    zoom,
    pan,
    setPan,
    modo,
    setModo,
    arrastando,
    aplicarZoom,
    resetarVisualizacao,
    converterTelaParaImagem,
    converterImagemParaTela,
    iniciarArrasto,
    moverArrasto,
    finalizarArrasto
  };
}
