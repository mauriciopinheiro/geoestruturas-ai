/**
 * Ambiente de Bancada GIS contendo Visualizador Canvas, Conferência e Estatísticas.
 */
import React, { useState } from 'react';
import { ProjetoLevantamento } from '../../tipos/levantamento';
import { DeteccaoEstrutura } from '../../tipos/deteccao';
import { PontoCoordenada, PoligonoAreaInteresse } from '../../tipos/poligono';
import { useControleCanvas } from '../../ganchos/useControleCanvas';
import { CanvasVisualizador } from './CanvasVisualizador';
import { BarraFerramentasGIS } from './BarraFerramentasGIS';
import { ControleCamadas, EstadoCamadasVisiveis } from './ControleCamadas';
import { ComparadorAntesDepois } from './ComparadorAntesDepois';
import { PainelConferencia } from '../conferencia/PainelConferencia';
import { PainelEstatisticas } from '../estatisticas/PainelEstatisticas';
import { CardInspecaoMarcador } from '../conferencia/CardInspecaoMarcador';
import { RegistroAuditoria } from '../../tipos/estatisticas';

interface AmbienteBancadaGISProps {
  projeto: ProjetoLevantamento;
  deteccoes: DeteccaoEstrutura[];
  estruturaSelecionada: DeteccaoEstrutura | null;
  aoSelecionarEstrutura: (e: DeteccaoEstrutura | null) => void;
  aoAdicionarEstrutura: (x: number, y: number) => void;
  aoRemoverEstrutura: (id: string) => void;
  aoMoverEstrutura: (id: string, x: number, y: number) => void;
  aoConfirmarEstrutura: (id: string) => void;
  aoDefinirAreaInteresse: (area: PoligonoAreaInteresse) => void;
  podeDesfazer: boolean;
  podeRefazer: boolean;
  aoDesfazer: () => void;
  aoRefazer: () => void;
  registrosAuditoria: RegistroAuditoria[];
}

export const AmbienteBancadaGIS: React.FC<AmbienteBancadaGISProps> = ({
  projeto,
  deteccoes,
  estruturaSelecionada,
  aoSelecionarEstrutura,
  aoAdicionarEstrutura,
  aoRemoverEstrutura,
  aoMoverEstrutura,
  aoConfirmarEstrutura,
  aoDefinirAreaInteresse,
  podeDesfazer,
  podeRefazer,
  aoDesfazer,
  aoRefazer,
  registrosAuditoria
}) => {
  const {
    zoom,
    pan,
    setPan,
    modo,
    setModo,
    aplicarZoom,
    resetarVisualizacao,
    converterTelaParaImagem,
    iniciarArrasto,
    moverArrasto,
    finalizarArrasto
  } = useControleCanvas();

  const [painelCamadasAberto, setPainelCamadasAberto] = useState(false);
  const [pontosPoligonoTemp, setPontosPoligonoTemp] = useState<PontoCoordenada[]>([]);
  const [camadas, setCamadas] = useState<EstadoCamadasVisiveis>({
    imagemOriginal: true,
    poligonoArea: true,
    estruturasConfirmadas: true,
    estruturasManuais: true,
    estruturasIncertas: true,
    estruturasRemovidas: false,
    rotulosIdentificadores: false,
    contornosCobertura: false
  });

  const alternarCamada = (chave: keyof EstadoCamadasVisiveis) => {
    setCamadas((prev) => ({ ...prev, [chave]: !prev[chave] }));
  };

  const centralizarEmCoordenadas = (x: number, y: number) => {
    const w = window.innerWidth / 2;
    const h = (window.innerHeight - 108) / 2;
    setPan({ x: w - x * zoom, y: h - y * zoom });
  };

  const lidarAdicionarPontoPoligono = (p: PontoCoordenada) => {
    const novos = [...pontosPoligonoTemp, p];
    setPontosPoligonoTemp(novos);
    if (novos.length >= 3) {
      aoDefinirAreaInteresse({
        id: `aoi-${Date.now()}`,
        nome: 'Área Delimitada Manualmente',
        pontos: novos,
        fechado: true,
        corBorda: '#00A896',
        corPreenchimento: 'rgba(0, 168, 150, 0.12)',
        detectadoAutomaticamente: false
      });
    }
  };

  return (
    <div className="workspace-gis-completo">
      {projeto.etapaAtiva !== 'resultado' && (
        <PainelConferencia
          deteccoes={deteccoes}
          estruturaSelecionada={estruturaSelecionada}
          aoSelecionarEstrutura={aoSelecionarEstrutura}
          aoConfirmar={aoConfirmarEstrutura}
          aoRemover={aoRemoverEstrutura}
          aoCentralizar={centralizarEmCoordenadas}
          registrosAuditoria={registrosAuditoria}
        />
      )}

      <div className="area-central-mapa">
        {projeto.etapaAtiva === 'resultado' ? (
          <ComparadorAntesDepois projeto={projeto} />
        ) : (
          <>
            <BarraFerramentasGIS
              modo={modo}
              aoMudarModo={setModo}
              aoZoomIn={() => aplicarZoom(1.25)}
              aoZoomOut={() => aplicarZoom(0.8)}
              aoResetarZoom={resetarVisualizacao}
              aoAlternarTelaCheia={() => {
                if (!document.fullscreenElement) document.documentElement.requestFullscreen();
                else document.exitFullscreen();
              }}
              podeDesfazer={podeDesfazer}
              podeRefazer={podeRefazer}
              aoDesfazer={aoDesfazer}
              aoRefazer={aoRefazer}
            />

            <ControleCamadas
              camadas={camadas}
              aoAlternarCamada={alternarCamada}
              aberto={painelCamadasAberto}
              aoAlternarPainel={() => setPainelCamadasAberto((v) => !v)}
            />

            <CanvasVisualizador
              projeto={projeto}
              deteccoes={deteccoes}
              estruturaSelecionada={estruturaSelecionada}
              aoSelecionarEstrutura={aoSelecionarEstrutura}
              aoAdicionarEstrutura={aoAdicionarEstrutura}
              aoRemoverEstrutura={aoRemoverEstrutura}
              aoMoverEstrutura={aoMoverEstrutura}
              modo={modo}
              zoom={zoom}
              pan={pan}
              converterTelaParaImagem={converterTelaParaImagem}
              iniciarArrasto={iniciarArrasto}
              moverArrasto={moverArrasto}
              finalizarArrasto={finalizarArrasto}
              camadas={camadas}
              pontosPoligonoTemp={pontosPoligonoTemp}
              aoAdicionarPontoPoligono={lidarAdicionarPontoPoligono}
            />

            {estruturaSelecionada && (
              <CardInspecaoMarcador
                estrutura={estruturaSelecionada}
                aoConfirmar={aoConfirmarEstrutura}
                aoRemover={aoRemoverEstrutura}
                aoCentralizar={centralizarEmCoordenadas}
                aoFechar={() => aoSelecionarEstrutura(null)}
              />
            )}
          </>
        )}
      </div>

      <PainelEstatisticas projeto={projeto} />
    </div>
  );
};
