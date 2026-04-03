// ============================================================
// Cliente HTTP — Axios com interceptor de autenticação Firebase
// ============================================================
// Toda chamada à API .NET passa por esta instância.
// O token JWT do Firebase Auth é injetado automaticamente.
// ============================================================

import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ---------------------------------------------------------------------------
// Interceptor de Request — injeta Bearer token do Firebase Auth
// ---------------------------------------------------------------------------
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('[api] Falha ao obter token de autenticação:', error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ---------------------------------------------------------------------------
// Interceptor de Response — tratamento centralizado de erros
// ---------------------------------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.warn('[api] Não autorizado — token inválido ou expirado.');
        // TODO: redirecionar para login ou forçar refresh do token
      }

      if (status === 403) {
        console.warn('[api] Acesso negado.');
      }

      if (status >= 500) {
        console.error('[api] Erro interno do servidor:', error.response.data);
      }
    } else if (error.request) {
      console.error('[api] Sem resposta do servidor — verifique a conexão.');
    }

    return Promise.reject(error);
  },
);

export default api;
