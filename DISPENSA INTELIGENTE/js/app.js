// Ponto de entrada: liga estado, validação, navegação e interface.
import * as estado from "./estado.js";
import * as ui from "./interface.js";
import { iniciar } from "./navegacao.js";
import { validarProduto, validarPreco } from "./validacao.js";

let config = { mercados: ["Mercado A", "Mercado B", "Mercado C"], categorias: ["Outros"], exemplos: [] };

function atualizar() {
  const itens = estado.listar();
  ui.renderInicio(itens);
  ui.renderDespensa(itens, acoes);
  ui.renderCompras(itens, acoes, config.mercados);
}

function confirmarGravacao(ok, texto) {
  if (ok) ui.mensagem(texto);
  else ui.mensagem("Não foi possível salvar neste aparelho (armazenamento cheio ou bloqueado).", "erro");
  atualizar();
}

const acoes = {
  repor(id) { confirmarGravacao(estado.repor(id), "Contagem reiniciada."); },
  remover(id, nome) {
    if (!confirm(`Remover "${nome}" da despensa?`)) return;
    confirmarGravacao(estado.remover(id), "Produto removido.");
  },
  salvarPrecos(id, campos) {
    const resultados = campos.map((c) => validarPreco(c.value));
    campos.forEach((c, k) => c.setAttribute("aria-invalid", resultados[k].ok ? "false" : "true"));
    if (resultados.some((r) => !r.ok)) {
      ui.mensagem("Use preços válidos, como 4,99. Deixe em branco o mercado sem preço.", "erro");
      return; // mantém o que foi digitado
    }
    confirmarGravacao(estado.definirPrecos(id, resultados.map((r) => r.valor)), "Preços salvos.");
  },
};

async function carregarConfig() {
  try {
    const resposta = await fetch("data/dados.json");
    if (!resposta.ok) throw new Error("HTTP " + resposta.status);
    config = { ...config, ...(await resposta.json()) };
  } catch (erro) {
    console.error(erro);
    ui.mensagem("Não foi possível carregar data/dados.json. Usando valores padrão.", "erro");
  }
  ui.preencherCategorias(config.categorias);
}

function ligarFormulario() {
  const form = document.getElementById("form-produto");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const r = validarProduto({
      nome: d.get("nome"), categoria: d.get("categoria"),
      quantidade: d.get("quantidade"), duracao: d.get("duracao"),
    });
    ["nome", "quantidade", "duracao"].forEach((c) => ui.erroCampo(c, r.erros[c]));
    if (!r.ok) {
      ui.mensagem("Corrija os campos destacados.", "erro");
      return; // não limpa o formulário: preserva o que foi digitado
    }
    const ok = estado.adicionar(r.valores);
    if (ok) form.reset();
    confirmarGravacao(ok, `"${r.valores.nome}" adicionado à despensa.`);
  });

  document.getElementById("exemplos").addEventListener("click", () => {
    if (!config.exemplos.length) { ui.mensagem("Nenhum exemplo disponível.", "erro"); return; }
    config.exemplos.forEach((x) => estado.adicionar(x));
    confirmarGravacao(true, "Exemplos fictícios adicionados.");
  });
}

function ligarLogin() {
  document.getElementById("form-login").addEventListener("submit", (e) => {
    e.preventDefault();
    document.getElementById("login-aviso").textContent =
      "Demonstração: a autenticação não está configurada. Nenhum dado foi enviado ou salvo.";
  });
}

function registrarServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("service-worker.js").catch((erro) => console.error("Service Worker:", erro));
}

async function iniciarApp() {
  window.addEventListener("online", ui.renderConexao);
  window.addEventListener("offline", ui.renderConexao);
  ui.renderConexao();
  await carregarConfig();
  ligarFormulario();
  ligarLogin();
  iniciar(atualizar);
  registrarServiceWorker();
}

iniciarApp();
