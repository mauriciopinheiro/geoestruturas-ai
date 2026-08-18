/**
 * Renderizador de marcadores e caixas delimitadoras sobre o Canvas 2D.
 */
import { DeteccaoEstrutura } from '../../tipos/deteccao';

export interface OpcoesRenderizacaoMarcadores {
  deteccoes: DeteccaoEstrutura[];
  zoom: number;
  idSelecionado?: string;
  idPairando?: string;
  exibirRotulos: boolean;
  exibirContornos: boolean;
  exibirRemovidos: boolean;
}

export function renderizarCamadaMarcadores(
  ctx: CanvasRenderingContext2D,
  opcoes: OpcoesRenderizacaoMarcadores
): void {
  const {
    deteccoes,
    zoom,
    idSelecionado,
    idPairando,
    exibirRotulos,
    exibirContornos,
    exibirRemovidos
  } = opcoes;

  const raioBase = Math.max(3.5, Math.min(12, 5.5 / Math.sqrt(zoom)));
  const larguraBorda = Math.max(1.2, raioBase * 0.3);

  for (const d of deteccoes) {
    if (d.status === 'rejeitado' && !exibirRemovidos) continue;

    const selecionado = d.id === idSelecionado;
    const pairando = d.id === idPairando;

    // 1. Contorno / Bounding box opcional
    if (exibirContornos && d.caixaDelimitadora) {
      ctx.strokeStyle = selecionado ? '#38BDF8' : 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 1 / zoom;
      ctx.strokeRect(
        d.caixaDelimitadora.xMin,
        d.caixaDelimitadora.yMin,
        d.caixaDelimitadora.largura,
        d.caixaDelimitadora.altura
      );
    }

    // 2. Halo de seleção ou hover
    if (selecionado || pairando) {
      ctx.beginPath();
      ctx.arc(d.x, d.y, raioBase * 2.2, 0, 2 * Math.PI);
      ctx.fillStyle = selecionado ? 'rgba(56, 189, 248, 0.35)' : 'rgba(255, 255, 255, 0.25)';
      ctx.fill();
    }

    // 3. Determinação da cor do marcador
    let corPreenchimento = '#EF4444'; // Vermelho clássico IA
    if (d.status === 'rejeitado') {
      corPreenchimento = '#64748B'; // Cinza rejeitado
    } else if (d.origem === 'manual') {
      corPreenchimento = '#3B82F6'; // Azul manual
    } else if (d.status === 'necessita_revisao' || d.status === 'revisao_borda') {
      corPreenchimento = '#F59E0B'; // Âmbar baixa confiança
    }

    // 4. Desenha o ponto central
    ctx.beginPath();
    ctx.arc(d.x, d.y, raioBase, 0, 2 * Math.PI);
    ctx.fillStyle = corPreenchimento;
    ctx.fill();
    ctx.lineWidth = larguraBorda;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();

    // 5. Rótulo de ID opcional
    if (exibirRotulos || selecionado || pairando) {
      ctx.font = `600 ${Math.max(9, Math.round(11 / Math.sqrt(zoom)))}px sans-serif`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
      ctx.shadowBlur = 3;
      ctx.fillText(d.codigoIdentificador, d.x, d.y - raioBase - 3);
      ctx.shadowBlur = 0;
    }
  }
}
