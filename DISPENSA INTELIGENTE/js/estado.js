// Estado da aplicação: lista de itens da despensa.
import { ler, gravar } from "./armazenamento.js";

const UM_DIA = 24 * 60 * 60 * 1000;
let itens = ler();

export const listar = () => itens;
export const diasRestantes = (i) => i.duracao - Math.floor((Date.now() - i.data) / UM_DIA);
export const estaAcabando = (i) => diasRestantes(i) <= 2;

const salvar = () => gravar(itens);
const achar = (id) => itens.find((i) => i.id === id);

export function adicionar(dados) {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  itens.push({ id, ...dados, data: Date.now(), precos: [null, null, null] });
  return salvar();
}

export function repor(id) {
  const item = achar(id);
  if (item) item.data = Date.now(); // reinicia a contagem
  return salvar();
}

export function remover(id) {
  itens = itens.filter((i) => i.id !== id);
  return salvar();
}

export function definirPrecos(id, precos) {
  const item = achar(id);
  if (item) item.precos = precos;
  return salvar();
}
