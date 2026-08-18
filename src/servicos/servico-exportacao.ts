/**
 * Serviço de exportação de imagens marcadas em alta resolução e dados GIS.
 */
import { ProjetoLevantamento } from '../tipos/levantamento';
import { carregarElementoImagem } from './processamento-imagem-base';

export interface OpcoesExportacaoImagem {
  incluirLegenda: boolean;
  incluirPoligono: boolean;
  qualidadeJpeg?: number;
}

export async function gerarImagemMarcadaAltaResolucao(
  projeto: ProjetoLevantamento,
  opcoes: OpcoesExportacaoImagem
): Promise<string> {
  const imgElement = await carregarElementoImagem(projeto.imagem.urlOriginal);
  const largura = imgElement.naturalWidth || projeto.imagem.largura;
  const altura = imgElement.naturalHeight || projeto.imagem.altura;

  const canvas = document.createElement('canvas');
  canvas.width = largura;
  canvas.height = altura;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Falha ao instanciar canvas de exportação.');

  // 1. Desenha a imagem original intacta
  ctx.drawImage(imgElement, 0, 0, largura, altura);

  // 2. Desenha a Área de Interesse (AOI) caso solicitado
  if (opcoes.incluirPoligono && projeto.areaInteresse?.pontos.length) {
    const pts = projeto.areaInteresse.pontos;
    ctx.beginPath();
    ctx.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
    ctx.closePath();
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = Math.max(3, Math.round(largura / 400));
    ctx.stroke();
    ctx.fillStyle = 'rgba(250, 204, 21, 0.08)';
    ctx.fill();
  }

  // 3. Desenha os marcadores das estruturas ativas
  const raio = Math.max(4, Math.round(largura / 280));
  const borda = Math.max(1.5, raio * 0.35);

  for (const d of projeto.deteccoes) {
    if (d.status === 'rejeitado') continue;

    ctx.beginPath();
    ctx.arc(d.x, d.y, raio, 0, 2 * Math.PI);

    let corPreenchimento = '#EF4444'; // Vermelho padrão
    if (d.origem === 'manual') corPreenchimento = '#3B82F6'; // Azul manual
    else if (d.status === 'necessita_revisao' || d.status === 'revisao_borda') {
      corPreenchimento = '#F59E0B'; // Âmbar revisão
    }

    ctx.fillStyle = corPreenchimento;
    ctx.fill();
    ctx.lineWidth = borda;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
  }

  // 4. Carimbo e legenda institucional técnica
  if (opcoes.incluirLegenda) {
    desenharLegendaTecnica(ctx, projeto, largura, altura);
  }

  return canvas.toDataURL('image/jpeg', opcoes.qualidadeJpeg ?? 0.95);
}

function desenharLegendaTecnica(
  ctx: CanvasRenderingContext2D,
  projeto: ProjetoLevantamento,
  largura: number,
  altura: number
): void {
  const boxLargura = Math.min(480, Math.round(largura * 0.38));
  const boxAltura = 130;
  const margem = 24;
  const x = margem;
  const y = altura - boxAltura - margem;

  ctx.save();
  ctx.fillStyle = 'rgba(10, 37, 64, 0.88)';
  ctx.roundRect ? ctx.roundRect(x, y, boxLargura, boxAltura, 8) : ctx.rect(x, y, boxLargura, boxAltura);
  ctx.fill();
  ctx.strokeStyle = '#00A896';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 14px sans-serif';
  ctx.fillText('LEVANTAMENTO TERRITORIAL — SEMAE', x + 16, y + 26);

  ctx.font = '12px sans-serif';
  ctx.fillStyle = '#E2E8F0';
  ctx.fillText(`Comunidade: ${projeto.nomeComunidade} (${projeto.municipio}-${projeto.unidadeFederativa})`, x + 16, y + 48);
  ctx.fillText(`Total Contabilizado: ${projeto.estatisticas.totalContabilizado} estruturas`, x + 16, y + 68);
  ctx.fillText(`Data: ${projeto.dataLevantamento} | Resp.: ${projeto.responsavelTecnico || 'Engenharia'}`, x + 16, y + 88);

  // Legenda de pontos
  ctx.beginPath();
  ctx.arc(x + 22, y + 108, 5, 0, 2 * Math.PI);
  ctx.fillStyle = '#EF4444';
  ctx.fill();
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#CBD5E1';
  ctx.font = '11px sans-serif';
  ctx.fillText('Estrutura Contabilizada', x + 34, y + 112);
  ctx.restore();
}

export function exportarGeoJSON(projeto: ProjetoLevantamento): string {
  const features = projeto.deteccoes
    .filter((d) => d.status !== 'rejeitado')
    .map((d) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [d.x, d.y] },
      properties: {
        id: d.id,
        codigo: d.codigoIdentificador,
        confianca: d.confianca,
        status: d.status,
        origem: d.origem,
        comunidade: projeto.nomeComunidade
      }
    }));

  return JSON.stringify(
    {
      type: 'FeatureCollection',
      name: `levantamento_${projeto.codigoProjeto}`,
      features
    },
    null,
    2
  );
}

export function exportarCSV(projeto: ProjetoLevantamento): string {
  const cabecalho = 'ID;Codigo;CoordX;CoordY;Confianca;Origem;Status;Comunidade;Data\n';
  const linhas = projeto.deteccoes
    .map((d) =>
      [
        d.id,
        d.codigoIdentificador,
        d.x.toFixed(2),
        d.y.toFixed(2),
        d.confianca.toFixed(2),
        d.origem,
        d.status,
        projeto.nomeComunidade,
        projeto.dataLevantamento
      ].join(';')
    )
    .join('\n');

  return cabecalho + linhas;
}
