import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ItemCarrinho } from '@/types';

interface CartContextData {
  cartItems: ItemCarrinho[];
  addToCart: (item: Omit<ItemCarrinho, 'quantidade'>) => void;
  removeFromCart: (produtoId: string, lojaId: string) => void;
  updateQuantity: (produtoId: string, lojaId: string, quantidade: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<ItemCarrinho[]>([]);

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    saveCart();
  }, [cartItems]);

  const loadCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('@acho:cart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    }
  };

  const saveCart = async () => {
    try {
      await AsyncStorage.setItem('@acho:cart', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Erro ao salvar carrinho:', error);
    }
  };

  const addToCart = (item: Omit<ItemCarrinho, 'quantidade'>) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(
        i => i.produtoId === item.produtoId && i.lojaId === item.lojaId,
      );

      if (existing) {
        return prevItems.map(i =>
          i.produtoId === item.produtoId && i.lojaId === item.lojaId
            ? { ...i, quantidade: i.quantidade + 1 }
            : i,
        );
      }

      return [...prevItems, { ...item, quantidade: 1 }];
    });
  };

  const removeFromCart = (produtoId: string, lojaId: string) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.produtoId === produtoId && item.lojaId === lojaId)),
    );
  };

  const updateQuantity = (produtoId: string, lojaId: string, quantidade: number) => {
    if (quantidade <= 0) {
      removeFromCart(produtoId, lojaId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.produtoId === produtoId && item.lojaId === lojaId
          ? { ...item, quantidade }
          : item,
      ),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.preco * item.quantidade, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantidade, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return context;
};