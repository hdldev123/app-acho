import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import {
  getFavoritos,
  adicionarFavorito,
  removerFavorito,
} from '@/services/favoritesService';

interface FavoritesContextData {
  favorites: string[];       // IDs das lojas favoritas
  loading: boolean;
  addToFavorites: (lojaId: string) => Promise<void>;
  removeFromFavorites: (lojaId: string) => Promise<void>;
  toggleFavorite: (lojaId: string) => Promise<void>;
  isFavorite: (lojaId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextData>({} as FavoritesContextData);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Carrega favoritos quando o usuário loga
  useEffect(() => {
    if (usuario) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [usuario]);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const lojas = await getFavoritos();
      setFavorites(lojas.map(l => l.id));
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = useCallback(async (lojaId: string) => {
    // Atualização otimista
    setFavorites(prev => [...prev, lojaId]);
    try {
      await adicionarFavorito(lojaId);
    } catch (error) {
      // Reverte em caso de erro
      setFavorites(prev => prev.filter(id => id !== lojaId));
      console.error('Erro ao adicionar favorito:', error);
      throw error;
    }
  }, []);

  const removeFromFavorites = useCallback(async (lojaId: string) => {
    setFavorites(prev => prev.filter(id => id !== lojaId));
    try {
      await removerFavorito(lojaId);
    } catch (error) {
      setFavorites(prev => [...prev, lojaId]);
      console.error('Erro ao remover favorito:', error);
      throw error;
    }
  }, []);

  const toggleFavorite = useCallback(async (lojaId: string) => {
    if (favorites.includes(lojaId)) {
      await removeFromFavorites(lojaId);
    } else {
      await addToFavorites(lojaId);
    }
  }, [favorites, addToFavorites, removeFromFavorites]);

  const isFavorite = useCallback(
    (lojaId: string) => favorites.includes(lojaId),
    [favorites],
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        addToFavorites,
        removeFromFavorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites deve ser usado dentro de FavoritesProvider');
  }
  return context;
};