// Tudo que mexe no DOM. Textos entram com textContent/append (sem innerHTML).
import { diasRestantes, estaAcabando } from "./estado.js";
import { calcular } from "./otimizador.js";

const $ = (id) => document.getElementById(id);
const real = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export function el(tag, attrs = {}, ...filhos) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  e.append(...filhos);
  return e;
}

let timer;
export function mensagem(texto, tipo = "sucesso") {
  const m = $("mensagem");
  m.textContent = texto;
  m.className = "mensagem " + (tipo === "erro" ? "erro-geral" : "sucesso");
  clearTimeout(timer);
  timer = setTimeout(() => { m.textContent = ""; m.className = "mensagem"; }, 5000);
}

export function erroCampo(id, texto) {
  $("erro-" + id).textContent = texto || "";
  $(id).setAttribute("aria-invalid", texto ? "true" : "false");
}

export function renderConexao() {
  const c = $("conexao");
  c.textContent = navigator.onLine ? "online" : "offline";
  c.className = navigator.onLine ? "" : "offline";
}

export function preencherCategorias(categorias) {
  $("categoria").replaceChildren(...categorias.map((c) => el("option", { value: c }, c)));
}

export function renderInicio(itens) {
  $("total").textContent = itens.length;
  $("total-acabando").textContent = itens.filter(estaAcabando).length;
}

function descricao(item) {
  const acabando = estaAcabando(item);
  return [
    el("strong", {}, item.nome),
    ` (${item.quantidade} un., ${item.categoria}) - ${diasRestantes(item)} dia(s) restantes - `,
    el("span", acabando ? { class: "status" } : {}, acabando ? "Acabando" : "OK"),
  ];
}

export function renderDespensa(itens, acoes) {
  const lista = $("lista-despensa");
  lista.replaceChildren();
  if (!itens.length) {
    lista.append(el("li", {}, "Nenhum produto cadastrado. Preencha o formulário acima."));
    return;
  }
  itens.forEach((item) => {
    lista.append(el("li", estaAcabando(item) ? { class: "acabando" } : {}, ...descricao(item),
      el("div", { class: "acoes" },
        el("button", { type: "button", onclick: () => acoes.repor(item.id) }, "Comprei de novo"),
        el("button", { type: "button", class: "perigo", onclick: () => acoes.remover(item.id, item.nome) }, "Remover"))));
  });
}

export function renderCompras(itens, acoes, mercados) {
  const lista = $("lista-compras");
  lista.replaceChildren();
  const acabando = itens.filter(estaAcabando);
  if (!acabando.length) lista.append(el("li", {}, "Nada acabando por enquanto."));

  acabando.forEach((item) => {
    const campos = mercados.map((m, k) => el("input", {
      id: `p-${item.id}-${k}`, inputmode: "decimal", placeholder: "ex.: 4,99",
      value: item.precos[k] === null ? "" : String(item.precos[k]).replace(".", ","),
    }));
    const form = el("form", { class: "precos", novalidate: "", onsubmit: (e) => { e.preventDefault(); acoes.salvarPrecos(item.id, campos); } },
      ...mercados.map((m, k) => el("label", { for: campos[k].id }, `${m} (R$ por unidade)`)).flatMap((l, k) => [l, campos[k]]),
      el("button", { type: "submit" }, "Salvar preços"));
    lista.append(el("li", { class: "acabando" }, ...descricao(item),
      el("div", { class: "acoes" }, el("button", { type: "button", onclick: () => acoes.repor(item.id) }, "Comprei de novo")), form));
  });

  const caixa = $("resultado");
  caixa.replaceChildren();
  const r = calcular(acabando);
  if (!r) { caixa.append(el("p", {}, "Informe o preço de pelo menos um item para ver a comparação.")); return; }

  caixa.append(el("p", {}, r.melhor
    ? `Melhor mercado único: ${mercados[r.melhor.mercado]}, ${real(r.melhor.total)}.`
    : "Nenhum mercado tem preço para todos os itens ainda."));
  caixa.append(el("p", {}, "Cesta otimizada (o mais barato de cada item):"));
  caixa.append(el("ul", {}, ...r.cesta.map((c) =>
    el("li", {}, `${c.item.nome}: ${mercados[c.mercado]}, ${real(c.subtotal)}`))));
  caixa.append(el("p", {}, `Total da cesta: ${real(r.totalCesta)}.` +
    (r.economia !== null ? ` Economia de ${real(r.economia)} (${r.percentual.toFixed(1).replace(".", ",")}%) em relação ao melhor mercado único.` : "")));
}
