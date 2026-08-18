/**
 * Modal orquestrador do fluxo em 3 etapas para criação de novo levantamento.
 */
import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { ProjetoLevantamento, MetadadosImagem } from '../../tipos/levantamento';
import { PoligonoAreaInteresse } from '../../tipos/poligono';
import { EtapaInformacoes, DadosCadastroLevantamento } from './EtapaInformacoes';
import { EtapaUploadImagem } from './EtapaUploadImagem';
import { EtapaDefinicaoArea } from './EtapaDefinicaoArea';
import { salvarProjeto } from '../../servicos/armazenamento-projetos';

interface ModalNovoLevantamentoProps {
  aberto: boolean;
  aoFechar: () => void;
  aoCriarProjeto: (novoProjeto: ProjetoLevantamento) => void;
}

export const ModalNovoLevantamento: React.FC<ModalNovoLevantamentoProps> = ({
  aberto,
  aoFechar,
  aoCriarProjeto
}) => {
  const [passo, setPasso] = useState<1 | 2 | 3>(1);
  const [dadosInfo, setDadosInfo] = useState<DadosCadastroLevantamento>({
    nomeProjeto: '',
    nomeComunidade: '',
    municipio: 'Piracicaba',
    unidadeFederativa: 'SP',
    dataLevantamento: new Date().toISOString().split('T')[0],
    responsavelTecnico: 'Maurício Pinheiro — Arquiteto de Dados Sênior',
    observacoes: ''
  });
  const [imagem, setImagem] = useState<MetadadosImagem | null>(null);
  const [areaInteresse, setAreaInteresse] = useState<PoligonoAreaInteresse | null>(null);

  if (!aberto) return null;

  const podeAvancar = () => {
    if (passo === 1) {
      return (
        dadosInfo.nomeProjeto.trim() !== '' &&
        dadosInfo.nomeComunidade.trim() !== '' &&
        dadosInfo.municipio.trim() !== ''
      );
    }
    if (passo === 2) return imagem !== null;
    return true;
  };

  const finalizarCriacao = () => {
    if (!imagem) return;
    const agora = new Date().toISOString();
    const codigo = `LEV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 900) + 100)}`;

    const novo: ProjetoLevantamento = {
      id: `proj-${Date.now()}`,
      codigoProjeto: codigo,
      nomeProjeto: dadosInfo.nomeProjeto,
      nomeComunidade: dadosInfo.nomeComunidade,
      municipio: dadosInfo.municipio,
      unidadeFederativa: dadosInfo.unidadeFederativa,
      dataLevantamento: dadosInfo.dataLevantamento,
      responsavelTecnico: dadosInfo.responsavelTecnico,
      observacoes: dadosInfo.observacoes,
      status: 'novo',
      etapaAtiva: 'area_interesse',
      imagem,
      areaInteresse: areaInteresse || undefined,
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
        confiancaMediaGeral: 0,
        percentualRevisado: 0
      },
      historicoAuditoria: [],
      criadoEm: agora,
      atualizadoEm: agora
    };

    salvarProjeto(novo);
    aoCriarProjeto(novo);
    aoFechar();
  };

  return (
    <div className="overlay-modal-assistente">
      <div className="card-modal-assistente">
        <div className="cabecalho-assistente">
          <div className="indicadores-passo-wizard">
            <div className={`passo-bolinha ${passo >= 1 ? 'ativo' : ''}`}>1</div>
            <div className={`linha-passo ${passo >= 2 ? 'ativa' : ''}`} />
            <div className={`passo-bolinha ${passo >= 2 ? 'ativo' : ''}`}>2</div>
            <div className={`linha-passo ${passo >= 3 ? 'ativa' : ''}`} />
            <div className={`passo-bolinha ${passo >= 3 ? 'ativo' : ''}`}>3</div>
          </div>
          <button type="button" className="btn-fechar-modal" onClick={aoFechar}>
            <X size={18} />
          </button>
        </div>

        <div className="corpo-assistente">
          {passo === 1 && (
            <EtapaInformacoes
              dados={dadosInfo}
              aoAtualizar={(novos) => setDadosInfo((prev) => ({ ...prev, ...novos }))}
            />
          )}

          {passo === 2 && (
            <EtapaUploadImagem imagem={imagem} aoDefinirImagem={setImagem} />
          )}

          {passo === 3 && imagem && (
            <EtapaDefinicaoArea
              imagem={imagem}
              areaInteresse={areaInteresse}
              aoDefinirArea={setAreaInteresse}
            />
          )}
        </div>

        <div className="rodape-assistente">
          {passo > 1 ? (
            <button
              type="button"
              className="btn-voltar-passo"
              onClick={() => setPasso((p) => (p - 1) as 1 | 2 | 3)}
            >
              <ArrowLeft size={16} />
              <span>Voltar</span>
            </button>
          ) : <div />}

          {passo < 3 ? (
            <button
              type="button"
              className="btn-avancar-passo"
              onClick={() => setPasso((p) => (p + 1) as 1 | 2 | 3)}
              disabled={!podeAvancar()}
            >
              <span>Avançar</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              className="btn-avancar-passo concluir"
              onClick={finalizarCriacao}
            >
              <Check size={16} />
              <span>Criar e Abrir Bancada GIS</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
