/**
 * Componente Raiz da Aplicação GeoEstruturas AI.
 */
import { useState, useEffect } from 'react';
import { ProjetoLevantamento } from './tipos/levantamento';
import { listarTodosProjetos, excluirProjeto } from './servicos/armazenamento-projetos';
import { carregarElementoImagem, obterDadosPixels } from './servicos/processamento-imagem-base';
import { executarAnaliseVisaoComputacional } from './servicos/motor-visao-computacional';
import { useLevantamento } from './ganchos/useLevantamento';
import { CabecalhoPrincipal } from './componentes/comum/CabecalhoPrincipal';
import { BarraSuperiorAcoes } from './componentes/comum/BarraSuperiorAcoes';
import { IndicadorCarregamentoIA } from './componentes/comum/IndicadorCarregamentoIA';
import { ModalAjuda } from './componentes/comum/ModalAjuda';
import { ModalNovoLevantamento } from './componentes/assistente/ModalNovoLevantamento';
import { PainelProjetos } from './componentes/dashboard/PainelProjetos';
import { AmbienteBancadaGIS } from './componentes/visualizador/AmbienteBancadaGIS';

import './estilos/variaveis.css';
import './estilos/base.css';
import './estilos/layout-cabecalho.css';
import './estilos/layout-etapas.css';
import './estilos/visualizador-canvas.css';
import './estilos/visualizador-ia.css';
import './estilos/conferencia-painel.css';
import './estilos/conferencia-inspecao.css';
import './estilos/comparador-layout.css';
import './estilos/comparador-slider.css';
import './estilos/dashboard-kpis.css';
import './estilos/dashboard-cards.css';
import './estilos/assistente-formulario.css';
import './estilos/assistente-upload.css';

export function App() {
  const [projetos, setProjetos] = useState<ProjetoLevantamento[]>([]);
  const [projetoSelecionado, setProjetoSelecionado] = useState<ProjetoLevantamento | null>(null);
  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [modalAjudaAberto, setModalAjudaAberto] = useState(false);

  const [processandoIA, setProcessandoIA] = useState(false);
  const [etapaIA, setEtapaIA] = useState(1);
  const [mensagemIA, setMensagemIA] = useState('');

  const recarregarProjetos = () => {
    const lista = listarTodosProjetos();
    setProjetos(lista);
  };

  useEffect(() => {
    recarregarProjetos();
  }, []);

  const lidarExcluirProjeto = (id: string) => {
    if (window.confirm('Deseja realmente excluir este levantamento territorial?')) {
      excluirProjeto(id);
      recarregarProjetos();
      if (projetoSelecionado?.id === id) setProjetoSelecionado(null);
    }
  };

  return (
    <div className="aplicacao-container">
      <CabecalhoPrincipal
        projetoAtivo={projetoSelecionado}
        aoVoltarParaDashboard={() => {
          recarregarProjetos();
          setProjetoSelecionado(null);
        }}
        aoAbrirNovoLevantamento={() => setModalNovoAberto(true)}
        aoAbrirAjuda={() => setModalAjudaAberto(true)}
      />

      {projetoSelecionado ? (
        <SessaoBancadaProjeto
          projetoInicial={projetoSelecionado}
          processandoIA={processandoIA}
          aoExecutarAnaliseIA={async (proj, aplicarDeteccoes) => {
            setProcessandoIA(true);
            setEtapaIA(1);
            setMensagemIA('Iniciando processamento espectral da imagem...');
            try {
              const imgEl = await carregarElementoImagem(proj.imagem.urlOriginal);
              const { dados } = obterDadosPixels(imgEl, 1200, 1200);
              const novas = await executarAnaliseVisaoComputacional({
                dadosImagem: dados,
                larguraOriginal: proj.imagem.largura,
                alturaOriginal: proj.imagem.altura,
                areaInteresse: proj.areaInteresse,
                notificarProgresso: (num, msg) => {
                  setEtapaIA(num);
                  setMensagemIA(msg);
                }
              });
              aplicarDeteccoes(novas);
            } catch (err) {
              alert('Falha ao processar imagem: ' + String(err));
            } finally {
              setProcessandoIA(false);
            }
          }}
        />
      ) : (
        <PainelProjetos
          projetos={projetos}
          aoSelecionarProjeto={(p) => setProjetoSelecionado(p)}
          aoCriarNovo={() => setModalNovoAberto(true)}
          aoExcluirProjeto={lidarExcluirProjeto}
        />
      )}

      {processandoIA && (
        <IndicadorCarregamentoIA etapaAtual={etapaIA} mensagemAtual={mensagemIA} />
      )}

      <ModalNovoLevantamento
        aberto={modalNovoAberto}
        aoFechar={() => setModalNovoAberto(false)}
        aoCriarProjeto={(novo) => {
          recarregarProjetos();
          setProjetoSelecionado(novo);
        }}
      />

      <ModalAjuda aberto={modalAjudaAberto} aoFechar={() => setModalAjudaAberto(false)} />
    </div>
  );
}

interface SessaoBancadaProjetoProps {
  projetoInicial: ProjetoLevantamento;
  processandoIA: boolean;
  aoExecutarAnaliseIA: (
    proj: ProjetoLevantamento,
    aplicar: (dets: ReturnType<typeof useLevantamento>['deteccoes']) => void
  ) => void;
}

function SessaoBancadaProjeto({
  projetoInicial,
  processandoIA,
  aoExecutarAnaliseIA
}: SessaoBancadaProjetoProps) {
  const {
    projeto,
    deteccoes,
    estruturaSelecionada,
    setEstruturaSelecionada,
    definirEtapa,
    definirAreaInteresse,
    aplicarResultadoIA,
    confirmarEstrutura,
    removerEstrutura,
    adicionarEstruturaManual,
    moverEstrutura,
    podeDesfazer,
    podeRefazer,
    desfazer,
    refazer
  } = useLevantamento(projetoInicial);

  return (
    <>
      <BarraSuperiorAcoes
        etapaAtiva={projeto.etapaAtiva}
        aoMudarEtapa={definirEtapa}
        aoExecutarAnaliseIA={() => aoExecutarAnaliseIA(projeto, aplicarResultadoIA)}
        processandoIA={processandoIA}
      />
      <AmbienteBancadaGIS
        projeto={projeto}
        deteccoes={deteccoes}
        estruturaSelecionada={estruturaSelecionada}
        aoSelecionarEstrutura={setEstruturaSelecionada}
        aoAdicionarEstrutura={adicionarEstruturaManual}
        aoRemoverEstrutura={removerEstrutura}
        aoMoverEstrutura={moverEstrutura}
        aoConfirmarEstrutura={confirmarEstrutura}
        aoDefinirAreaInteresse={definirAreaInteresse}
        podeDesfazer={podeDesfazer}
        podeRefazer={podeRefazer}
        aoDesfazer={desfazer}
        aoRefazer={refazer}
        registrosAuditoria={projeto.historicoAuditoria}
      />
    </>
  );
}

export default App;
