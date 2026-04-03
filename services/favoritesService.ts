// ============================================================
// Serviço de Favoritos — consome a API .NET
// ============================================================

import api from './api';
import { Loja } from '@/types';

export const getFavoritos = async (): Promise<Loja[]> => {
  const { data } = await api.get<Loja[]>('/api/favoritos');
  return data;
};

export const adicionarFavorito = async (lojaId: string): Promise<void> => {
  await api.post(`/api/favoritos/${lojaId}`);
};

export const removerFavorito = async (lojaId: string): Promise<void> => {
  await api.delete(`/api/favoritos/${lojaId}`);
};
