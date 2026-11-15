// ---------- Dados (salvos no localStorage) ----------
var itens = JSON.parse(localStorage.getItem("itens")) || [];

function salvar() {
  localStorage.setItem("itens", JSON.stringify(itens));
}

// ---------- Cálculo de dias restantes ----------
function diasRestantes(item) {
  var umDia = 24 * 60 * 60 * 1000;
  var passados = Math.floor((Date.now() - item.data) / umDia);
  return item.duracao - passados;
}

function estaAcabando(item) {
  return diasRestantes(item) <= 2;
}

// ---------- Ações ----------
function adicionar() {
  var nome = document.getElementById("nome").value.trim();
  var quantidade = Number(document.getElementById("quantidade").value);
  var duracao = Number(document.getElementById("duracao").value);

  if (nome === "" || quantidade < 1 || duracao < 1) {
    alert("Preencha nome, quantidade e duração.");
    return;
  }

  itens.push({ nome: nome, quantidade: quantidade, duracao: duracao, data: Date.now() });
  salvar();
  document.getElementById("nome").value = "";
  document.getElementById("quantidade").value = "";
  document.getElementById("duracao").value = "";
  mostrar();
}

function comprouDeNovo(posicao) {
  itens[posicao].data = Date.now(); // reinicia a contagem
  salvar();
  mostrar();
}

// ---------- Mostrar na tela ----------
function criarLinha(item, posicao, comBotao) {
  var li = document.createElement("li");
  if (estaAcabando(item)) li.className = "acabando";

  var status = estaAcabando(item) ? "Acabando" : "OK";
  li.innerHTML = "<strong>" + item.nome + "</strong> (" + item.quantidade + " un.)<br>" +
    diasRestantes(item) + " dia(s) restantes - <span class='status'>" + status + "</span>";

  if (comBotao) {
    var botao = document.createElement("button");
    botao.textContent = "Comprei de novo";
    botao.addEventListener("click", function () { comprouDeNovo(posicao); });
    li.appendChild(document.createElement("br"));
    li.appendChild(botao);
  }
  return li;
}

function mostrar() {
  var listaDespensa = document.getElementById("lista-despensa");
  var listaCompras = document.getElementById("lista-compras");
  listaDespensa.innerHTML = "";
  listaCompras.innerHTML = "";
  var acabando = 0;

  itens.forEach(function (item, posicao) {
    listaDespensa.appendChild(criarLinha(item, posicao, false));
    if (estaAcabando(item)) {
      listaCompras.appendChild(criarLinha(item, posicao, true));
      acabando++;
    }
  });

  if (itens.length === 0) listaDespensa.innerHTML = "<li>Nenhum produto cadastrado.</li>";
  if (acabando === 0) listaCompras.innerHTML = "<li>Nada acabando por enquanto.</li>";

  document.getElementById("total").textContent = itens.length;
  document.getElementById("total-acabando").textContent = acabando;
}

// ---------- Navegação entre telas ----------
document.querySelectorAll("[data-ir]").forEach(function (botao) {
  botao.addEventListener("click", function () {
    document.querySelectorAll(".tela").forEach(function (tela) {
      tela.classList.toggle("ativa", tela.id === botao.dataset.ir);
    });
    mostrar();
  });
});

// ---------- Detecção de conexão ----------
function atualizarConexao() {
  var el = document.getElementById("conexao");
  el.textContent = navigator.onLine ? "online" : "offline";
  el.className = navigator.onLine ? "" : "offline";
}
window.addEventListener("online", atualizarConexao);
window.addEventListener("offline", atualizarConexao);

document.getElementById("adicionar").addEventListener("click", adicionar);
atualizarConexao();
mostrar();