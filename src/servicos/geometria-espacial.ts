/**
 * Algoritmos geométricos para Área de Interesse, intersecção e centróides.
 */
import { PontoCoordenada, CaixaDelimitadora } from '../tipos/poligono';

/**
 * Algoritmo de Ray-Casting para determinar se um ponto está dentro de um polígono arbitrário.
 */
export function pontoDentroDoPoligono(
  ponto: PontoCoordenada,
  vertices: PontoCoordenada[]
): boolean {
  if (vertices.length < 3) return true; // Se não há polígono fechado, considera dentro

  let dentro = false;
  const { x, y } = ponto;
  const numVertices = vertices.length;

  for (let i = 0, j = numVertices - 1; i < numVertices; j = i++) {
    const xi = vertices[i].x;
    const yi = vertices[i].y;
    const xj = vertices[j].x;
    const yj = vertices[j].y;

    const intersecta =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersecta) dentro = !dentro;
  }

  return dentro;
}

export function calcularDistanciaEuclidiana(
  p1: PontoCoordenada,
  p2: PontoCoordenada
): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function calcularCaixaEnvolvente(pontos: PontoCoordenada[]): CaixaDelimitadora {
  let xMin = Infinity,
    yMin = Infinity,
    xMax = -Infinity,
    yMax = -Infinity;
  for (const p of pontos) {
    if (p.x < xMin) xMin = p.x;
    if (p.y < yMin) yMin = p.y;
    if (p.x > xMax) xMax = p.x;
    if (p.y > yMax) yMax = p.y;
  }
  return {
    xMin,
    yMin,
    xMax,
    yMax,
    largura: Math.max(0, xMax - xMin),
    altura: Math.max(0, yMax - yMin)
  };
}

export function calcularInterseccaoIoU(
  c1: CaixaDelimitadora,
  c2: CaixaDelimitadora
): number {
  const xA = Math.max(c1.xMin, c2.xMin);
  const yA = Math.max(c1.yMin, c2.yMin);
  const xB = Math.min(c1.xMax, c2.xMax);
  const yB = Math.min(c1.yMax, c2.yMax);

  const larguraInter = Math.max(0, xB - xA);
  const alturaInter = Math.max(0, yB - yA);
  const areaInter = larguraInter * alturaInter;
  if (areaInter <= 0) return 0;

  const areaC1 = c1.largura * c1.altura;
  const areaC2 = c2.largura * c2.altura;
  const areaUniao = areaC1 + areaC2 - areaInter;

  return areaUniao > 0 ? areaInter / areaUniao : 0;
}
