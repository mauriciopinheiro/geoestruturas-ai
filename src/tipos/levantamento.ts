/**
 * Tipos centrais do projeto de Levantamento Territorial.
 */
import { DeteccaoEstrutura } from './deteccao';
import { PoligonoAreaInteresse } from './poligono';
import { EstatisticasLevantamento, RegistroAuditoria } from './estatisticas';

export type StatusLevantamento =
  | 'novo'
  | 'em_analise'
  | 'em_conferencia'
  | 'concluido';

export type EtapaFluxo =
  | 'imagem'
  | 'area_interesse'
  | 'analise_ia'
  | 'conferencia'
  | 'resultado';

export interface MetadadosImagem {
  urlOriginal: string;
  urlMarcada?: string;
  largura: number;
  altura: number;
  nomeArquivo: string;
  tamanhoBytes: number;
  tipoMime: string;
  indiceNitidez?: number;
  qualidadeAprovada?: boolean;
}

export interface ProjetoLevantamento {
  id: string;
  codigoProjeto: string; // Ex: LEV-2026-001
  nomeProjeto: string;
  nomeComunidade: string;
  municipio: string;
  unidadeFederativa: string;
  dataLevantamento: string;
  responsavelTecnico: string;
  observacoes: string;
  status: StatusLevantamento;
  etapaAtiva: EtapaFluxo;
  imagem: MetadadosImagem;
  areaInteresse?: PoligonoAreaInteresse;
  deteccoes: DeteccaoEstrutura[];
  estatisticas: EstatisticasLevantamento;
  historicoAuditoria: RegistroAuditoria[];
  criadoEm: string;
  atualizadoEm: string;
}
