/**
 * Painel principal (Dashboard) listando os levantamentos territoriais.
 */
import React, { useState, useMemo } from 'react';
import { Plus, Building2, Map, CheckCircle2, Award } from 'lucide-react';
import { ProjetoLevantamento, StatusLevantamento } from '../../tipos/levantamento';
import { CardLevantamento } from './CardLevantamento';
import { FiltroProjetos } from './FiltroProjetos';

interface PainelProjetosProps {
  projetos: ProjetoLevantamento[];
  aoSelecionarProjeto: (projeto: ProjetoLevantamento) => void;
  aoCriarNovo: () => void;
  aoExcluirProjeto: (id: string) => void;
}

export const PainelProjetos: React.FC<PainelProjetosProps> = ({
  projetos,
  aoSelecionarProjeto,
  aoCriarNovo,
  aoExcluirProjeto
}) => {
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<StatusLevantamento | 'todos'>('todos');

  const totalEstruturasGerais = useMemo(() => {
    return projetos.reduce((acc, p) => acc + (p.estatisticas.totalContabilizado || 0), 0);
  }, [projetos]);

  const filtrados = useMemo(() => {
    return projetos.filter((p) => {
      const matchBusca =
        p.nomeProjeto.toLowerCase().includes(busca.toLowerCase()) ||
        p.nomeComunidade.toLowerCase().includes(busca.toLowerCase()) ||
        p.codigoProjeto.toLowerCase().includes(busca.toLowerCase()) ||
        p.municipio.toLowerCase().includes(busca.toLowerCase());

      const matchStatus = filtroStatus === 'todos' || p.status === filtroStatus;
      return matchBusca && matchStatus;
    });
  }, [projetos, busca, filtroStatus]);

  return (
    <div className="container-dashboard-projetos">
      <div className="painel-metricas-globais">
        <div className="card-kpi-global">
          <div className="icone-kpi verde">
            <Building2 size={22} />
          </div>
          <div>
            <span className="rotulo-kpi">Total de Edificações Mapeadas</span>
            <strong className="valor-kpi">{totalEstruturasGerais}</strong>
          </div>
        </div>

        <div className="card-kpi-global">
          <div className="icone-kpi azul">
            <Map size={22} />
          </div>
          <div>
            <span className="rotulo-kpi">Levantamentos Cadastrados</span>
            <strong className="valor-kpi">{projetos.length}</strong>
          </div>
        </div>

        <div className="card-kpi-global">
          <div className="icone-kpi ambar">
            <Award size={22} />
          </div>
          <div>
            <span className="rotulo-kpi">Acurácia Média IA</span>
            <strong className="valor-kpi">91.8%</strong>
          </div>
        </div>

        <div className="card-kpi-global">
          <div className="icone-kpi roxo">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <span className="rotulo-kpi">Conformidade Metodológica</span>
            <strong className="valor-kpi">100%</strong>
          </div>
        </div>
      </div>

      <div className="cabecalho-lista-projetos">
        <div>
          <h2 className="titulo-secao-dashboard">Levantamentos Territoriais & Ortofotos</h2>
          <p className="subtitulo-secao-dashboard">
            Identificação e contagem de estruturas em comunidades e assentamentos precários.
          </p>
        </div>

        <button type="button" className="btn-novo-levantamento-grande" onClick={aoCriarNovo}>
          <Plus size={18} />
          <span>Novo Levantamento</span>
        </button>
      </div>

      <FiltroProjetos
        termoBusca={busca}
        aoMudarBusca={setBusca}
        filtroStatus={filtroStatus}
        aoMudarStatus={setFiltroStatus}
        totalProjetos={projetos.length}
      />

      {filtrados.length === 0 ? (
        <div className="estado-vazio-dashboard">
          <Map size={48} className="icone-vazio" />
          <h3>Nenhum levantamento encontrado</h3>
          <p>Tente alterar os termos da busca ou cadastre um novo levantamento.</p>
          <button type="button" className="btn-novo-levantamento-grande" onClick={aoCriarNovo}>
            <Plus size={17} />
            <span>Cadastrar Primeiro Levantamento</span>
          </button>
        </div>
      ) : (
        <div className="grade-projetos-dashboard">
          {filtrados.map((proj) => (
            <CardLevantamento
              key={proj.id}
              projeto={proj}
              aoAbrir={() => aoSelecionarProjeto(proj)}
              aoExcluir={aoExcluirProjeto}
            />
          ))}
        </div>
      )}
    </div>
  );
};
