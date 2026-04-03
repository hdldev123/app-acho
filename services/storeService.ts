// ============================================================
// Serviço de Lojas — consome a API .NET
// ============================================================

import api from './api';
import { Loja, Produto, ApiPaginada } from '@/types';

// --- Lojas ---

export const getLojas = async (page = 1, pageSize = 20): Promise<ApiPaginada<Loja>> => {
  const { data } = await api.get<ApiPaginada<Loja>>('/api/lojas', {
    params: { page, pageSize },
  });
  return data;
};

export const getLojaById = async (id: string): Promise<Loja> => {
  const { data } = await api.get<Loja>(`/api/lojas/${id}`);
  return data;
};

export const getLojasByCategoria = async (
  categoria: string,
  page = 1,
  pageSize = 20,
): Promise<ApiPaginada<Loja>> => {
  const { data } = await api.get<ApiPaginada<Loja>>('/api/lojas', {
    params: { categoria, page, pageSize },
  });
  return data;
};

export const buscarLojas = async (
  termo: string,
  page = 1,
  pageSize = 20,
): Promise<ApiPaginada<Loja>> => {
  const { data } = await api.get<ApiPaginada<Loja>>('/api/lojas/buscar', {
    params: { termo, page, pageSize },
  });
  return data;
};

// --- Produtos de uma loja ---

export const getProdutosByLoja = async (lojaId: string): Promise<Produto[]> => {
  const { data } = await api.get<Produto[]>(`/api/lojas/${lojaId}/produtos`);
  return data;
};

export const getProdutoById = async (lojaId: string, produtoId: string): Promise<Produto> => {
  const { data } = await api.get<Produto>(`/api/lojas/${lojaId}/produtos/${produtoId}`);
  return data;
};