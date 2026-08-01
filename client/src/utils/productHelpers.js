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
  const baseImage = product?.image || product?.mainImage || "";
  const gallery = Array.isArray(product?.gallery)
    ? product.gallery.filter(Boolean)
    : [];
  const galleryImages = Array.isArray(product?.galleryImages)
    ? product.galleryImages.filter(Boolean)
    : [];
  const images = [baseImage, ...gallery, ...galleryImages].filter(Boolean);

  if (!images.length) {
    return [];
  }

  const uniqueImages = [...new Set(images)];

  if (uniqueImages.length < 3) {
    return uniqueImages;
  }

  return uniqueImages.slice(0, 3);
};

export const getShippingFee = (subtotal) => {
  return subtotal >= 30000000 ? 0 : 99000;
};
