// Rotas por hash: só a tela da rota atual fica visível e o menu acompanha a URL.
const ROTAS = ["login", "inicio", "despensa", "compras", "sobre"];

export function iniciar(aoMudar) {
  function ir() {
    const pedida = location.hash.slice(1);
    const rota = ROTAS.includes(pedida) ? pedida : "inicio";
    document.querySelectorAll(".tela").forEach((t) => { t.hidden = t.id !== rota; });
    document.querySelectorAll("nav a").forEach((a) => {
      if (a.getAttribute("href") === "#" + rota) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    aoMudar(rota);
  }
  window.addEventListener("hashchange", ir);
  ir();
}
