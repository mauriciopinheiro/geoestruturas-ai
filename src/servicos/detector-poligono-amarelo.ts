/**
 * Detector de polígonos pré-desenhados (ex: demarcação amarela de comunidade).
 * Utiliza segmentação espectral e rastreamento de contornos para polígonos côncavos.
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
  const mapaBinario = new Uint8Array(width * height);
  let totalAmarelos = 0;

  // Segmentação espectral de amarelo (R alto, G alto, B baixo)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const ehAmarelo = r > 160 && g > 150 && b < 100 && Math.abs(r - g) < 55;
      if (ehAmarelo) {
        mapaBinario[y * width + x] = 1;
        totalAmarelos++;
      }
    }
  }

  if (totalAmarelos < 35) return null;

  // Rastreamento dos pontos perimetrais ordenados por ângulo e proximidade
  const pontosPerimetro: PontoCoordenada[] = [];
  const passo = Math.max(2, Math.round(width / 300));

  for (let y = 0; y < height; y += passo) {
    let primeiroX = -1;
    let ultimoX = -1;
    for (let x = 0; x < width; x += passo) {
      if (mapaBinario[y * width + x] === 1) {
        if (primeiroX === -1) primeiroX = x;
        ultimoX = x;
      }
    }
    if (primeiroX !== -1) {
      pontosPerimetro.push({ x: primeiroX * escalaX, y: y * escalaY });
      if (ultimoX !== primeiroX) {
        pontosPerimetro.push({ x: ultimoX * escalaX, y: y * escalaY });
      }
    }
  }

  if (pontosPerimetro.length < 6) return null;

  // Simplificação do contorno perimetral
  const verticesSimplificados = simplificarContorno(pontosPerimetro, 18);
  if (verticesSimplificados.length < 3) return null;

  return {
    id: `aoi-auto-${Date.now()}`,
    nome: 'Área Delimitada por Polígono Amarelo',
    pontos: verticesSimplificados,
    fechado: true,
    corBorda: '#FACC15',
    corPreenchimento: 'rgba(250, 204, 21, 0.12)',
    detectadoAutomaticamente: true
  };
}

function simplificarContorno(pontos: PontoCoordenada[], tolerancia: number): PontoCoordenada[] {
  // Ordena os pontos angularmente em relação ao centróide para fechar o polígono
  const centroX = pontos.reduce((acc, p) => acc + p.x, 0) / pontos.length;
  const centroY = pontos.reduce((acc, p) => acc + p.y, 0) / pontos.length;

  const ordenados = [...pontos].sort((a, b) => {
    const angA = Math.atan2(a.y - centroY, a.x - centroX);
    const angB = Math.atan2(b.y - centroY, b.x - centroX);
    return angA - angB;
  });

  const filtrados: PontoCoordenada[] = [];
  for (let i = 0; i < ordenados.length; i++) {
    const atual = ordenados[i];
    const anterior = filtrados[filtrados.length - 1];
    if (!anterior) {
      filtrados.push(atual);
      continue;
    }
    const dx = atual.x - anterior.x;
    const dy = atual.y - anterior.y;
    if (Math.sqrt(dx * dx + dy * dy) >= tolerancia) {
      filtrados.push(atual);
    }
  }

  return filtrados;
}
