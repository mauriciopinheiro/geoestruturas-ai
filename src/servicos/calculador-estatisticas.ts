/**
 * Calculador de estatísticas do levantamento territorial.
 * Garante a regra fundamental: 1 Marcador Ativo = 1 Estrutura Contabilizada.
 */
import { DeteccaoEstrutura } from '../tipos/deteccao';
import { EstatisticasLevantamento } from '../tipos/estatisticas';

export function calcularEstatisticasLevantamento(
  deteccoes: DeteccaoEstrutura[]
): EstatisticasLevantamento {
  let detectadosIA = 0;
  let confirmadosIA = 0;
  let adicionadosManualmente = 0;
  let removidosManualmente = 0;
  let necessitamRevisao = 0;
  let revisadosManualmente = 0;
  let altaConfianca = 0;
  let mediaConfianca = 0;
  let baixaConfianca = 0;
  let somaConfianca = 0;

  for (const d of deteccoes) {
    if (d.origem === 'ia') {
      detectadosIA++;
      somaConfianca += d.confianca;

      if (d.nivelConfianca === 'alta') altaConfianca++;
      else if (d.nivelConfianca === 'media') mediaConfianca++;
      else baixaConfianca++;
    } else {
      adicionadosManualmente++;
      somaConfianca += 1.0;
    }

    if (d.status === 'confirmado') {
      confirmadosIA++;
    } else if (d.status === 'necessita_revisao' || d.status === 'revisao_borda') {
      necessitamRevisao++;
    } else if (d.status === 'rejeitado') {
      removidosManualmente++;
    }

    if (d.revisadoEm) {
      revisadosManualmente++;
    }
  }

  // Estruturas ativas que contam para o total final
  const totalContabilizado = deteccoes.filter(
    (d) => d.status === 'confirmado' || d.status === 'manual' || d.status === 'detectado'
  ).length;

  const totalParaRevisao = deteccoes.filter((d) => d.status !== 'rejeitado').length;
  const percentualRevisado =
    totalParaRevisao > 0
      ? Math.min(100, Math.round((revisadosManualmente / totalParaRevisao) * 100))
      : 100;

  const totalDeteccoes = deteccoes.length;
  const confiancaMediaGeral =
    totalDeteccoes > 0
      ? Number(((somaConfianca / totalDeteccoes) * 100).toFixed(1))
      : 0;

  return {
    totalContabilizado,
    detectadosIA,
    confirmadosIA,
    adicionadosManualmente,
    removidosManualmente,
    necessitamRevisao,
    revisadosManualmente,
    altaConfianca,
    mediaConfianca,
    baixaConfianca,
    confiancaMediaGeral,
    percentualRevisado
  };
}
