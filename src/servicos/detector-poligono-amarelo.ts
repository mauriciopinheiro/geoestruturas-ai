/**
 * Detector automático de polígonos pré-desenhados (ex: demarcação amarela em satélite).
 */
import { PontoCoordenada, PoligonoAreaInteresse } from '../tipos/poligono';

export function detectarPoligonoAmarelo(
  dados: ImageData,
  larguraOriginal: number,
  alturaOriginal: number
): PoligonoAreaInteresse | null {
  const { width, height, data } = dados;
  const escalaX = larguraOriginal / width;
  const escalaY = alturaOriginal / height;
  const pontosAmarelos: PontoCoordenada[] = [];

  // Amostragem em grade para encontrar pixels de traçado amarelo
  for (let y = 0; y < height; y += 3) {
    for (let x = 0; x < width; x += 3) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Critério espectral para amarelo vivo (R alto, G alto, B baixo)
      const ehAmarelo = r > 165 && g > 150 && b < 90 && Math.abs(r - g) < 65;
      if (ehAmarelo) {
        pontosAmarelos.push({ x: x * escalaX, y: y * escalaY });
      }
    }
  }

  // Se não encontrou quantidade mínima de pontos que formem um perímetro
  if (pontosAmarelos.length < 25) {
    return null;
  }

  // Extração dos vértices externos (Convex Hull Simplificado de Graham/Monotone)
  const vertices = calcularEnvoltoriaConvexa(pontosAmarelos);
  if (vertices.length < 3) return null;

  return {
    id: `aoi-${Date.now()}`,
    nome: 'Área Delimitada (Auto Detectada)',
    pontos: vertices,
    fechado: true,
    corBorda: '#FACC15',
    corPreenchimento: 'rgba(250, 204, 21, 0.12)',
    detectadoAutomaticamente: true
  };
}

function calcularEnvoltoriaConvexa(pontos: PontoCoordenada[]): PontoCoordenada[] {
  const pts = [...pontos].sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));
  const cruzamento = (o: PontoCoordenada, a: PontoCoordenada, b: PontoCoordenada) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const inferior: PontoCoordenada[] = [];
  for (const p of pts) {
    while (
      inferior.length >= 2 &&
      cruzamento(inferior[inferior.length - 2], inferior[inferior.length - 1], p) <= 0
    ) {
      inferior.pop();
    }
    inferior.push(p);
  }

  const superior: PontoCoordenada[] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (
      superior.length >= 2 &&
      cruzamento(superior[superior.length - 2], superior[superior.length - 1], p) <= 0
    ) {
      superior.pop();
    }
    superior.push(p);
  }

  inferior.pop();
  superior.pop();
  return inferior.concat(superior);
}
