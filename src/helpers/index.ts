export function formatCurrency(amount: number) {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount);
}


export function formatCurrencyPeru(amount: number) {
  return amount.toLocaleString("es-PE", {
    style: "currency",
    currency: "PEN",
  });
}