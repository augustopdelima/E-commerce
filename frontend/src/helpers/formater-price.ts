export const formatPrice = (price: string) => {
  const parsedPrice = parseFloat(price);
  return isNaN(parsedPrice) ? "" : `R$ ${parsedPrice.toFixed(2).replace(".", ",")}`;
};
