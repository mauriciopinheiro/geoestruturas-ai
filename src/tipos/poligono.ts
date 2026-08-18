/**
 * Definições de tipos para coordenadas e polígonos de Área de Interesse (AOI).
 */

export interface PontoCoordenada {
  x: number;
  y: number;
}

export interface PoligonoAreaInteresse {
  id: string;
  nome: string;
  pontos: PontoCoordenada[];
  fechado: boolean;
  corBorda: string;
  corPreenchimento: string;
  detectadoAutomaticamente: boolean;
}

export interface CaixaDelimitadora {
  xMin: number;
  yMin: number;
  xMax: number;
  yMax: number;
  largura: number;
  altura: number;
}
