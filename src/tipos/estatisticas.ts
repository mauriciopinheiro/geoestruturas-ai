/**
 * Tipos para consolidação estatística e métricas de auditoria.
 */

export interface EstatisticasLevantamento {
  totalContabilizado: number;
  detectadosIA: number;
  confirmadosIA: number;
  adicionadosManualmente: number;
  removidosManualmente: number;
  necessitamRevisao: number;
  revisadosManualmente: number;
  altaConfianca: number;
  mediaConfianca: number;
  baixaConfianca: number;
  confiancaMediaGeral: number;
  percentualRevisado: number;
}

export interface RegistroAuditoria {
  id: string;
  dataHora: string;
  acao: 'adicionar' | 'confirmar' | 'remover' | 'mover' | 'revisar_depois' | 'reprocessar';
  codigoEstrutura: string;
  descricao: string;
  detalhes?: {
    anterior?: Record<string, unknown>;
    novo?: Record<string, unknown>;
  };
}
