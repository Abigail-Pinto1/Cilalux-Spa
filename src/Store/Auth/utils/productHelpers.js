/**
 * Get the stock quantity from a product regardless of field name
 */
export const getProductStock = (product) => {
  return product.quantity || product.countInStock || product.stock || 0;
};

/**
 * Check if a product is in stock
 */
export const isProductInStock = (product) => {
  return getProductStock(product) > 0;
};

/**
 * Get the image URL from a product regardless of format
 */
export const getProductImage = (product) => {
  if (product.images && product.images.length > 0) {
    return product.images[0].url || product.images[0];
  }
  return product.image || 'https://via.placeholder.com/400';
};


