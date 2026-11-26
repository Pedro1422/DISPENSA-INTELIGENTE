// Melhor mercado único e cesta otimizada (preços são por unidade).
export function calcular(itens) {
  const base = itens.filter((i) => i.precos.some((p) => p !== null));
  if (base.length === 0) return null;

  const totais = [0, 1, 2].map((m) => ({
    mercado: m,
    completo: base.every((i) => i.precos[m] !== null),
    total: base.reduce((soma, i) => soma + (i.precos[m] ?? 0) * i.quantidade, 0),
  }));
  const elegiveis = totais.filter((t) => t.completo);
  const melhor = elegiveis.length
    ? elegiveis.reduce((a, b) => (b.total < a.total ? b : a))
    : null;

  const cesta = base.map((item) => {
    const validos = item.precos.map((p, m) => ({ p, m })).filter((x) => x.p !== null);
    const menor = validos.reduce((a, b) => (b.p < a.p ? b : a));
    return { item, mercado: menor.m, subtotal: menor.p * item.quantidade };
  });
  const totalCesta = cesta.reduce((soma, c) => soma + c.subtotal, 0);
  const economia = melhor ? melhor.total - totalCesta : null;
  const percentual = melhor && melhor.total > 0 ? (economia / melhor.total) * 100 : 0;

  return { melhor, cesta, totalCesta, economia, percentual };
}
