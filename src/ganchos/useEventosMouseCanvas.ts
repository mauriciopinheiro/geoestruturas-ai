/**
 * Gancho para tratamento de eventos de mouse e interação com o Canvas GIS.
 */
import { useState, useCallback } from 'react';
import { DeteccaoEstrutura } from '../tipos/deteccao';
import { PontoCoordenada } from '../tipos/poligono';
import { ModoFerramenta } from './useControleCanvas';

interface OpcoesEventosMouseCanvas {
  deteccoes: DeteccaoEstrutura[];
  zoom: number;
  modo: ModoFerramenta;
  exibirRemovidos: boolean;
  converterTelaParaImagem: (x: number, y: number, rect: DOMRect) => PontoCoordenada;
  iniciarArrasto: (x: number, y: number) => void;
  moverArrasto: (x: number, y: number) => void;
  finalizarArrasto: () => void;
  aoSelecionarEstrutura: (e: DeteccaoEstrutura | null) => void;
  aoAdicionarEstrutura: (x: number, y: number) => void;
  aoRemoverEstrutura: (id: string) => void;
  aoMoverEstrutura: (id: string, x: number, y: number) => void;
  aoAdicionarPontoPoligono?: (p: PontoCoordenada) => void;
}

export function useEventosMouseCanvas(opcoes: OpcoesEventosMouseCanvas) {
  const {
    deteccoes,
    zoom,
    modo,
    exibirRemovidos,
    converterTelaParaImagem,
    iniciarArrasto,
    moverArrasto,
    finalizarArrasto,
    aoSelecionarEstrutura,
    aoAdicionarEstrutura,
    aoRemoverEstrutura,
    aoMoverEstrutura,
    aoAdicionarPontoPoligono
  } = opcoes;

  const [idPairando, setIdPairando] = useState<string | undefined>(undefined);
  const [arrastandoMarcadorId, setArrastandoMarcadorId] = useState<string | null>(null);

  const encontrarMarcadorProximo = useCallback(
    (coords: PontoCoordenada): DeteccaoEstrutura | null => {
      const raioBusca = Math.max(16 / zoom, 12);
      for (const d of deteccoes) {
        if (d.status === 'rejeitado' && !exibirRemovidos) continue;
        const dx = d.x - coords.x;
        const dy = d.y - coords.y;
        if (Math.sqrt(dx * dx + dy * dy) <= raioBusca) return d;
      }
      return null;
    },
    [deteccoes, zoom, exibirRemovidos]
  );

  const lidarMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;
      const coords = converterTelaParaImagem(e.clientX, e.clientY, canvas.getBoundingClientRect());
      const encontrado = encontrarMarcadorProximo(coords);

      if (modo === 'adicionar') {
        aoAdicionarEstrutura(coords.x, coords.y);
        return;
      }
      if (modo === 'remover' && encontrado) {
        aoRemoverEstrutura(encontrado.id);
        return;
      }
      if (modo === 'desenhar_poligono' && aoAdicionarPontoPoligono) {
        aoAdicionarPontoPoligono(coords);
        return;
      }
      if (modo === 'mover' && encontrado) {
        setArrastandoMarcadorId(encontrado.id);
        aoSelecionarEstrutura(encontrado);
        return;
      }
      if (encontrado) {
        aoSelecionarEstrutura(encontrado);
      } else {
        iniciarArrasto(e.clientX, e.clientY);
      }
    },
    [
      converterTelaParaImagem,
      encontrarMarcadorProximo,
      modo,
      aoAdicionarEstrutura,
      aoRemoverEstrutura,
      aoAdicionarPontoPoligono,
      aoSelecionarEstrutura,
      iniciarArrasto
    ]
  );

  const lidarMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement | null) => {
      if (!canvas) return;
      const coords = converterTelaParaImagem(e.clientX, e.clientY, canvas.getBoundingClientRect());

      if (arrastandoMarcadorId) {
        aoMoverEstrutura(arrastandoMarcadorId, coords.x, coords.y);
        return;
      }

      moverArrasto(e.clientX, e.clientY);
      const encontrado = encontrarMarcadorProximo(coords);
      setIdPairando(encontrado?.id);
    },
    [arrastandoMarcadorId, converterTelaParaImagem, aoMoverEstrutura, moverArrasto, encontrarMarcadorProximo]
  );

  const lidarMouseUp = useCallback(() => {
    setArrastandoMarcadorId(null);
    finalizarArrasto();
  }, [finalizarArrasto]);

  return {
    idPairando,
    lidarMouseDown,
    lidarMouseMove,
    lidarMouseUp
  };
}
