// ============================================================
// Serviço de Usuário — consome a API .NET
// ============================================================

import api from './api';
import { Usuario } from '@/types';

export const getMeuPerfil = async (): Promise<Usuario> => {
  const { data } = await api.get<Usuario>('/api/usuarios/me');
  return data;
};

export const atualizarPerfil = async (payload: Partial<Usuario>): Promise<Usuario> => {
  const { data } = await api.put<Usuario>('/api/usuarios/me', payload);
  return data;
};
