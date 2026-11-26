// Leitura e gravação no localStorage, com tratamento de erros.
const CHAVE = "despensa-inteligente:v1";

function itemValido(i) {
  return i && typeof i.nome === "string" && Number(i.duracao) > 0 &&
    Number.isFinite(i.data) && Array.isArray(i.precos) && typeof i.id === "string";
}

export function ler() {
  try {
    const bruto = localStorage.getItem(CHAVE);
    if (!bruto) return [];
    const dados = JSON.parse(bruto);
    return Array.isArray(dados) ? dados.filter(itemValido) : [];
  } catch (erro) {
    console.error("Falha ao ler dados salvos:", erro);
    return [];
  }
}

export function gravar(itens) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(itens));
    return true;
  } catch (erro) {
    console.error("Falha ao salvar dados:", erro);
    return false;
  }
}
