/**
 * Levantamentos territoriais pré-carregados com imagens reais e detecções exatas.
 */
import { ProjetoLevantamento } from '../tipos/levantamento';
import { DeteccaoEstrutura, NivelConfianca, StatusDeteccao } from '../tipos/deteccao';
import { calcularEstatisticasLevantamento } from './calculador-estatisticas';
import { COORDENADAS_AMOSTRA_VITORIA, COORDENADAS_AMOSTRA_ESPERANCA } from './coordenadas-amostras';

export function obterProjetosAmostra(): ProjetoLevantamento[] {
  const agora = '2026-08-18T10:00:00.000Z';

  const projetoVitoria: ProjetoLevantamento = {
    id: 'proj-amostra-vitoria-001',
    codigoProjeto: 'LEV-2026-001',
    nomeProjeto: 'Levantamento Territorial — Comunidade Vitória',
    nomeComunidade: 'Comunidade Vitória',
    municipio: 'Piracicaba',
    unidadeFederativa: 'SP',
    dataLevantamento: '18/08/2026',
    responsavelTecnico: 'Maurício Pinheiro — Arquiteto de Dados Sênior',
    observacoes: 'Contagem restrita estritamente ao perímetro demarcado pela linha amarela no Córrego Itapuã.',
    status: 'concluido',
    etapaAtiva: 'resultado',
    imagem: {
      urlOriginal: '/assets/amostras/comunidade_vitoria_poligono.jpg',
      largura: 1024,
      altura: 507,
      nomeArquivo: 'comunidade_vitoria_poligono.jpg',
      tamanhoBytes: 470338,
      tipoMime: 'image/jpeg',
      indiceNitidez: 88,
      qualidadeAprovada: true
    },
    areaInteresse: {
      id: 'aoi-vitoria-01',
      nome: 'Perímetro Amarelo — Comunidade Vitória',
      pontos: [
        { x: 702, y: 131 },
        { x: 600, y: 41 },
        { x: 413, y: 229 },
        { x: 350, y: 188 },
        { x: 290, y: 239 },
        { x: 226, y: 189 },
        { x: 148, y: 290 },
        { x: 444, y: 506 },
        { x: 525, y: 405 },
        { x: 496, y: 370 }
      ],
      fechado: true,
      corBorda: '#FACC15',
      corPreenchimento: 'rgba(250, 204, 21, 0.12)',
      detectadoAutomaticamente: true
    },
    deteccoes: [],
    estatisticas: {
      totalContabilizado: 0,
      detectadosIA: 0,
      confirmadosIA: 0,
      adicionadosManualmente: 0,
      removidosManualmente: 0,
      necessitamRevisao: 0,
      revisadosManualmente: 0,
      altaConfianca: 0,
      mediaConfianca: 0,
      baixaConfianca: 0,
      confiancaMediaGeral: 94.2,
      percentualRevisado: 100
    },
    historicoAuditoria: [
      {
        id: 'aud-1',
        dataHora: '2026-08-18 10:15',
        acao: 'reprocessar',
        codigoEstrutura: 'GERAL',
        descricao: 'Análise de coberturas realizada estritamente dentro do polígono amarelo.'
      }
    ],
    criadoEm: agora,
    atualizadoEm: agora
  };

  const projetoEsperanca: ProjetoLevantamento = {
    id: 'proj-amostra-esperanca-002',
    codigoProjeto: 'LEV-2026-002',
    nomeProjeto: 'Levantamento Territorial — Comunidade Nova Esperança',
    nomeComunidade: 'Comunidade Nova Esperança',
    municipio: 'Piracicaba',
    unidadeFederativa: 'SP',
    dataLevantamento: '15/08/2026',
    responsavelTecnico: 'Maurício Pinheiro — Arquiteto de Dados Sênior',
    observacoes: 'Mapeamento individual de residências com vias principais identificadas.',
    status: 'em_conferencia',
    etapaAtiva: 'conferencia',
    imagem: {
      urlOriginal: '/assets/amostras/comunidade_nova_esperanca.jpg',
      largura: 1001,
      altura: 852,
      nomeArquivo: 'comunidade_nova_esperanca.jpg',
      tamanhoBytes: 416349,
      tipoMime: 'image/jpeg',
      indiceNitidez: 92,
      qualidadeAprovada: true
    },
    areaInteresse: {
      id: 'aoi-esperanca-01',
      nome: 'Setor Habitacional Noroeste',
      pontos: [
        { x: 180, y: 170 },
        { x: 450, y: 90 },
        { x: 860, y: 60 },
        { x: 800, y: 620 },
        { x: 500, y: 720 },
        { x: 190, y: 880 }
      ],
      fechado: true,
      corBorda: '#00A896',
      corPreenchimento: 'rgba(0, 168, 150, 0.10)',
      detectadoAutomaticamente: false
    },
    deteccoes: [],
    estatisticas: {
      totalContabilizado: 0,
      detectadosIA: 0,
      confirmadosIA: 0,
      adicionadosManualmente: 0,
      removidosManualmente: 0,
      necessitamRevisao: 0,
      revisadosManualmente: 0,
      altaConfianca: 0,
      mediaConfianca: 0,
      baixaConfianca: 0,
      confiancaMediaGeral: 96.5,
      percentualRevisado: 85
    },
    historicoAuditoria: [],
    criadoEm: agora,
    atualizadoEm: agora
  };

  construirDeteccoes(projetoVitoria, COORDENADAS_AMOSTRA_VITORIA, 1024, 507);
  construirDeteccoes(projetoEsperanca, COORDENADAS_AMOSTRA_ESPERANCA, 1001, 852);

  return [projetoVitoria, projetoEsperanca];
}

function construirDeteccoes(
  proj: ProjetoLevantamento,
  coordenadas: Array<[number, number]>,
  largura: number,
  altura: number
): void {
  const dets: DeteccaoEstrutura[] = [];
  const agora = new Date().toISOString();

  for (let i = 0; i < coordenadas.length; i++) {
    const [x, y] = coordenadas[i];
    const num = i + 1;
    const conf = Number((0.85 + ((i % 10) / 10) * 0.13).toFixed(2));
    const nivel: NivelConfianca = conf >= 0.88 ? 'alta' : 'media';
    const status: StatusDeteccao = 'confirmado';

    dets.push({
      id: `det-${proj.id}-${num}`,
      codigoIdentificador: `B${String(num).padStart(4, '0')}`,
      x,
      y,
      caixaDelimitadora: {
        xMin: Math.max(0, x - 6),
        yMin: Math.max(0, y - 6),
        xMax: Math.min(largura, x + 6),
        yMax: Math.min(altura, y + 6),
        largura: 12,
        altura: 12
      },
      confianca: conf,
      nivelConfianca: nivel,
      origem: 'ia',
      status,
      dentroAreaInteresse: true,
      casoBorda: false,
      criadoEm: agora,
      atualizadoEm: agora
    });
  }

  proj.deteccoes = dets;
  proj.estatisticas = calcularEstatisticasLevantamento(dets);
}
