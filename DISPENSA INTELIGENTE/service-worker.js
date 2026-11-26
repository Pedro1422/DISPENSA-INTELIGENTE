// Cache-first. Ao alterar qualquer arquivo do app, aumente a versão abaixo (v1 -> v2):
// o evento "activate" apaga os caches antigos e o app passa a usar os arquivos novos.
const VERSAO = "despensa-v1";
const ARQUIVOS = [
  "./", "index.html", "css/style.css", "data/dados.json",
  "js/app.js", "js/armazenamento.js", "js/estado.js", "js/interface.js",
  "js/navegacao.js", "js/otimizador.js", "js/validacao.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSAO).then((c) => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n !== VERSAO).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((guardado) => guardado || fetch(e.request).catch(() => caches.match("index.html")))
  );
});
