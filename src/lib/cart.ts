export type CartItem = {
  id: string;
  slug: string;
  name: string;
  sku: string;
  price: number;
  image?: string;
  qty: number;
};

export const CART_STORAGE_KEY = "wonderland-cart";

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.qty, 0);
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, item) => sum + item.price * item.qty, 0);
}

export function createOrderReference() {
  return `WL-${Date.now().toString(36).toUpperCase()}`;
}
