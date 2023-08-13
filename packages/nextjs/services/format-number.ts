export const formatNumber = (numberAmount: number) => {
  return numberAmount
    .toFixed(3)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "'");
};
