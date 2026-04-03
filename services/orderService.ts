// ============================================================
// Serviço de Pedidos — consome a API .NET
// ============================================================

import api from './api';
import { Pedido, CriarPedidoRequest, StatusPedido, ApiPaginada } from '@/types';

export { StatusPedido };

export const criarPedido = async (payload: CriarPedidoRequest): Promise<Pedido> => {
  const { data } = await api.post<Pedido>('/api/pedidos', payload);
  return data;
};

export const getPedidoById = async (id: string): Promise<Pedido> => {
  const { data } = await api.get<Pedido>(`/api/pedidos/${id}`);
  return data;
};

export const getMeusPedidos = async (
  page = 1,
  pageSize = 20,
): Promise<ApiPaginada<Pedido>> => {
  const { data } = await api.get<ApiPaginada<Pedido>>('/api/pedidos', {
    params: { page, pageSize },
  });
  return data;
};

export const cancelarPedido = async (id: string): Promise<void> => {
  await api.patch(`/api/pedidos/${id}/cancelar`);
};