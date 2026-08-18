/**
 * Definições de tipos para detecções de estruturas/barracos.
 */
import { CaixaDelimitadora, PontoCoordenada } from './poligono';

export type StatusDeteccao =
  | 'detectado'
  | 'confirmado'
  | 'necessita_revisao'
  | 'manual'
  | 'rejeitado'
  | 'revisao_borda';

export type OrigemDeteccao = 'ia' | 'manual';

export type NivelConfianca = 'alta' | 'media' | 'baixa';

export interface DeteccaoEstrutura {
  id: string;
  codigoIdentificador: string; // Ex: B0001
  x: number;
  y: number;
  caixaDelimitadora?: CaixaDelimitadora;
  mascaraSegmentacao?: PontoCoordenada[];
  confianca: number; // 0.0 a 1.0
  nivelConfianca: NivelConfianca;
  origem: OrigemDeteccao;
  status: StatusDeteccao;
  dentroAreaInteresse: boolean;
  casoBorda: boolean;
  observacao?: string;
  criadoEm: string;
  atualizadoEm: string;
  revisadoPor?: string;
  revisadoEm?: string;
}

export interface FiltroDeteccoes {
  status?: StatusDeteccao | 'todos';
  nivelConfianca?: NivelConfianca | 'todos';
  origem?: OrigemDeteccao | 'todos';
  somenteDentroAOI?: boolean;
}
