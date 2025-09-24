import React, { createContext, useContext, useEffect, useState } from "react";

const CardContext = createContext();

export const useCardContext = () => useContext(CardContext);

export const CardProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
    }
  }, [cart]);

  const addProduct = (product) => {
    const { store_id, store_name, ...item } = product;
    setCart((prevCart) => {
      const storeCart = prevCart[store_id] || {
        storeId: store_id,
        storeName: store_name,
        items: [],
      };

      const existing = storeCart.items.find((p) => p.id === item.id);
      const updatedItems = existing ? storeCart.items.map((p) => (p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p)) : [...storeCart.items, { ...item, quantity: 1 }];

      return {
        ...prevCart,
        [store_id]: {
          ...storeCart,
          items: updatedItems,
        },
      };
    });
  };

  const increaseQuantity = (storeId, productId) => {
    setCart((prevCart) => {
      const storeCart = prevCart[storeId];
      if (!storeCart) return prevCart;

      const updatedItems = storeCart.items.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item));

      return {
        ...prevCart,
        [storeId]: {
          ...storeCart,
          items: updatedItems,
        },
      };
    });
  };

  const decreaseQuantity = (storeId, productId) => {
    setCart((prevCart) => {
      const storeCart = prevCart[storeId];
      if (!storeCart) return prevCart;

      const updatedItems = storeCart.items.map((item) => (item.id === productId ? { ...item, quantity: item.quantity - 1 } : item)).filter((item) => item.quantity > 0);

      if (updatedItems.length === 0) {
        const { [storeId]: _, ...rest } = prevCart;
        return rest;
      }

      return {
        ...prevCart,
        [storeId]: {
          ...storeCart,
          items: updatedItems,
        },
      };
    });
  };

  const removeProduct = (storeId, productId) => {
    setCart((prevCart) => {
      const storeCart = prevCart[storeId];
      if (!storeCart) return prevCart;

      const updatedItems = storeCart.items.filter((item) => item.id !== productId);

      if (updatedItems.length === 0) {
        const { [storeId]: _, ...rest } = prevCart;
        return rest;
      }

      return {
        ...prevCart,
        [storeId]: {
          ...storeCart,
          items: updatedItems,
        },
      };
    });
  };

  const removeStoreFromCart = (storeId) => {
    try {
      const currentCart = JSON.parse(localStorage.getItem("cart")) || {};
      console.log(currentCart);
      const { [storeId]: _, ...updatedCart } = currentCart;
      console.log(updatedCart, [storeId]);

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCart(updatedCart);
    } catch (error) {
      console.error("Failed to remove store from cart:", error);
    }
  };

  return (
    <CardContext.Provider
      value={{
        cart,
        addProduct,
        increaseQuantity,
        decreaseQuantity,
        removeProduct,
        removeStoreFromCart,
      }}
    >
      {children}
    </CardContext.Provider>
  );
};
