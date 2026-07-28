export const getDiscountText = (product) => {
  if (product?.discount) return product.discount;

  if (
    typeof product?.price === "number" &&
    typeof product?.oldPrice === "number" &&
    product.oldPrice > product.price
  ) {
    return `-${Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)}%`;
  }

  return "-0%";
};

export const getProductGallery = (product) => {
  const baseImage = product?.image || "";
  const gallery = Array.isArray(product?.gallery) ? product.gallery.filter(Boolean) : [];
  const images = [baseImage, ...gallery].filter(Boolean);

  if (!images.length) {
    return [];
  }

  while (images.length < 3) {
    images.push(images[0]);
  }

  return images.slice(0, 3);
};

export const getShippingFee = (subtotal) => {
  return subtotal >= 30000000 ? 0 : 99000;
};
