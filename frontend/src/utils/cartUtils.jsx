export const getCart = () => {
  try {
    const rawUser = localStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    const userId = user?._id || "guest";
    
    const cart = localStorage.getItem(`cart_${userId}`);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
};

export const addToCart = (product) => {
  try {
    const rawUser = localStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    const userId = user?._id || "guest";
    
    const cart = getCart();
    const exists = cart.some((item) => item._id === product._id);
    if (!exists) {
      cart.push(product);
      localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
      window.dispatchEvent(new Event("cart-updated"));
      return true;
    }
    return false;
  } catch {
    return false;
  }
};

export const removeFromCart = (productId) => {
  try {
    const rawUser = localStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    const userId = user?._id || "guest";
    
    let cart = getCart();
    cart = cart.filter((item) => item._id !== productId);
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  } catch (err) {
    console.error("Failed to remove item from cart", err);
  }
};

export const clearCart = () => {
  try {
    const rawUser = localStorage.getItem("user");
    const user = rawUser ? JSON.parse(rawUser) : null;
    const userId = user?._id || "guest";
    
    localStorage.removeItem(`cart_${userId}`);
    window.dispatchEvent(new Event("cart-updated"));
  } catch (err) {
    console.error("Failed to clear cart", err);
  }
};

export const getCartCount = () => {
  return getCart().length;
};
