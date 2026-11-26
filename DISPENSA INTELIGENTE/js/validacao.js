// Validação dos formulários.
function inteiro(texto, min, max) {
  const t = texto.trim();
  const n = Number(t);
  return t !== "" && Number.isInteger(n) && n >= min && n <= max ? n : null;
}

export function validarProduto(campos) {
  const erros = {};
  const nome = campos.nome.replace(/\s+/g, " ").trim();
  if (!nome) erros.nome = "Informe o nome do produto.";
  else if (nome.length < 2 || nome.length > 40) erros.nome = "O nome deve ter de 2 a 40 caracteres.";

  const quantidade = inteiro(campos.quantidade, 1, 999);
  if (quantidade === null) erros.quantidade = "Informe um número inteiro de 1 a 999.";

  const duracao = inteiro(campos.duracao, 1, 365);
  if (duracao === null) erros.duracao = "Informe um número inteiro de 1 a 365 dias.";

  return {
    ok: Object.keys(erros).length === 0,
    erros,
    valores: { nome, categoria: campos.categoria, quantidade, duracao },
  };
}

// Campo vazio é permitido (sem preço nesse mercado).
export function validarPreco(texto) {
  const t = texto.trim().replace(",", ".");
  if (t === "") return { ok: true, valor: null };
  const v = Number(t);
  if (!Number.isFinite(v) || v <= 0 || v > 100000) return { ok: false, valor: null };
  return { ok: true, valor: Math.round(v * 100) / 100 };
}
