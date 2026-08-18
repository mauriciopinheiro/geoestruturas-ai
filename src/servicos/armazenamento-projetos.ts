/**
 * Gerenciador de persistência local para projetos de levantamento territorial.
 */
import { ProjetoLevantamento } from '../tipos/levantamento';
import { obterProjetosAmostra } from './projetos-amostra';

const CHAVE_ARMAZENAMENTO = 'geoestruturas_projetos_v2';

export function listarTodosProjetos(): ProjetoLevantamento[] {
  try {
    const dados = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    if (!dados) {
      const amostras = obterProjetosAmostra();
      salvarListaProjetos(amostras);
      return amostras;
    }
    return JSON.parse(dados) as ProjetoLevantamento[];
  } catch (erro) {
    console.error('Erro ao ler projetos do armazenamento local:', erro);
    return obterProjetosAmostra();
  }
}

export function obterProjetoPorId(id: string): ProjetoLevantamento | null {
  const lista = listarTodosProjetos();
  return lista.find((p) => p.id === id) || null;
}

export function salvarProjeto(projeto: ProjetoLevantamento): void {
  const lista = listarTodosProjetos();
  const index = lista.findIndex((p) => p.id === projeto.id);
  const atualizado = { ...projeto, atualizadoEm: new Date().toISOString() };

  if (index >= 0) {
    lista[index] = atualizado;
  } else {
    lista.unshift(atualizado);
  }

  salvarListaProjetos(lista);
}

export function excluirProjeto(id: string): void {
  const lista = listarTodosProjetos().filter((p) => p.id !== id);
  salvarListaProjetos(lista);
}

export function redefinirParaAmostrasOficiais(): ProjetoLevantamento[] {
  const amostras = obterProjetosAmostra();
  salvarListaProjetos(amostras);
  return amostras;
}

function salvarListaProjetos(lista: ProjetoLevantamento[]): void {
  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(lista));
  } catch (erro) {
    console.error('Erro ao salvar projetos no armazenamento local:', erro);
  }
}
