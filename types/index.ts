// ============================================================
// Tipos centralizados do domínio — alinhados com a API .NET 8
// ============================================================
// Todos os IDs são Guid no C# → string no TypeScript
// As datas vêm como ISO-8601 string do backend
// ============================================================

// --- Usuário ---

export interface Usuario {
  id: string;            // Guid
  nome: string;
  email: string;
  telefone?: string;
  endereco?: string;
  fotoPerfil?: string;
  criadoEm: string;      // ISO date
  atualizadoEm: string;  // ISO date
}

// --- Loja ---

export interface Loja {
  id: string;            // Guid
  proprietarioId: string; // Guid
  nome: string;
  descricao: string;
  categoria: string;
  imagemUrl: string;
  endereco: string;
  telefone: string;
  avaliacao: number;
  estaAberta: boolean;
  criadoEm: string;
  atualizadoEm: string;
  produtos?: Produto[];
}

// --- Produto ---

export interface Produto {
  id: string;            // Guid
  lojaId: string;        // Guid
  nome: string;
  descricao: string;
  preco: number;
  imagemUrl: string;
  disponivel: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

// --- Pedido ---

export enum StatusPedido {
  PENDENTE = 'Pendente',
  CONFIRMADO = 'Confirmado',
  PREPARANDO = 'Preparando',
  SAIU_PARA_ENTREGA = 'SaiuParaEntrega',
  ENTREGUE = 'Entregue',
  CANCELADO = 'Cancelado',
}

export interface ItemPedido {
  id: string;            // Guid
  pedidoId: string;      // Guid
  produtoId: string;     // Guid
  nomeProduto: string;
  imagemProdutoUrl: string;
  precoUnitario: number;
  quantidade: number;
  subtotal: number;
}

export interface Pedido {
  id: string;            // Guid
  usuarioId: string;     // Guid
  lojaId: string;        // Guid
  nomeLoja: string;
  status: StatusPedido;
  metodoPagamento: string;
  enderecoEntrega: string;
  observacoes?: string;
  subtotal: number;
  taxaEntrega: number;
  total: number;
  itens: ItemPedido[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface CriarPedidoRequest {
  lojaId: string;
  itens: {
    produtoId: string;
    quantidade: number;
  }[];
  metodoPagamento: string;
  enderecoEntrega: string;
  observacoes?: string;
}

// --- Carrinho (estado local no app) ---

export interface ItemCarrinho {
  produtoId: string;     // Guid
  lojaId: string;        // Guid
  nomeLoja: string;
  nomeProduto: string;
  imagemUrl: string;
  preco: number;
  quantidade: number;
}

// --- Respostas genéricas da API ---

export interface ApiResponse<T> {
  sucesso: boolean;
  dados: T;
  mensagem?: string;
}

export interface ApiPaginada<T> {
  itens: T[];
  paginaAtual: number;
  totalPaginas: number;
  totalItens: number;
}
