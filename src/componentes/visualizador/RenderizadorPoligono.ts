/**
 * Renderizador de polígono da Área de Interesse (AOI) e vértices interativos.
 */
import { PoligonoAreaInteresse, PontoCoordenada } from '../../tipos/poligono';

export interface OpcoesRenderizacaoPoligono {
  poligono?: PoligonoAreaInteresse;
  pontosTemporarios?: PontoCoordenada[];
  zoom: number;
  indiceVerticeSelecionado?: number;
  modoEdicao: boolean;
}

export function renderizarCamadaPoligono(
  ctx: CanvasRenderingContext2D,
  opcoes: OpcoesRenderizacaoPoligono
): void {
  const { poligono, pontosTemporarios, zoom, indiceVerticeSelecionado, modoEdicao } = opcoes;
  const pontos = pontosTemporarios || poligono?.pontos || [];

  if (pontos.length < 2) return;

  // 1. Desenha as linhas do polígono
  ctx.beginPath();
  ctx.moveTo(pontos[0].x, pontos[0].y);
  for (let i = 1; i < pontos.length; i++) {
    ctx.lineTo(pontos[i].x, pontos[i].y);
  }

  if (poligono?.fechado || (!pontosTemporarios && pontos.length >= 3)) {
    ctx.closePath();
    ctx.fillStyle = poligono?.corPreenchimento || 'rgba(250, 204, 21, 0.12)';
    ctx.fill();
  }

  ctx.strokeStyle = poligono?.corBorda || '#FACC15';
  ctx.lineWidth = Math.max(1.8, 3 / Math.sqrt(zoom));
  ctx.stroke();

  // 2. Desenha manipuladores de vértices se em modo de edição
  if (modoEdicao) {
    const raioVertice = Math.max(4, 6 / Math.sqrt(zoom));
    for (let i = 0; i < pontos.length; i++) {
      const p = pontos[i];
      const selecionado = i === indiceVerticeSelecionado;

      ctx.beginPath();
      ctx.arc(p.x, p.y, raioVertice, 0, 2 * Math.PI);
      ctx.fillStyle = selecionado ? '#38BDF8' : '#FFFFFF';
      ctx.fill();
      ctx.lineWidth = 2 / zoom;
      ctx.strokeStyle = '#0F172A';
      ctx.stroke();
    }
  }
}
