# 📍 Achô! — Marketplace Local

Aplicativo mobile de marketplace local que conecta consumidores a comércios de bairro como padarias, mercados, farmácias e restaurantes.

## 🏗️ Arquitetura

O app consome um **backend dedicado em .NET 8** (REST API) para toda a lógica de dados. O **Firebase** é utilizado **exclusivamente para autenticação** (login/cadastro via email e senha).

```
┌─────────────┐     JWT Bearer      ┌──────────────────┐
│  App Mobile │ ──────────────────▷  │  API .NET 8      │
│  (Expo/RN)  │                     │  (REST)          │
└──────┬──────┘                     └──────────────────┘
       │
       │  Firebase Auth
       ▼
┌─────────────┐
│  Firebase   │
│  (Auth only)│
└─────────────┘
```

**Fluxo de autenticação:**
1. Usuário faz login/cadastro via Firebase Auth
2. O app obtém o **token JWT** do Firebase (`getIdToken()`)
3. Um interceptor Axios injeta o token em todas as requisições: `Authorization: Bearer <token>`
4. A API .NET valida o token e processa a requisição

## 🛠️ Stack

| Tecnologia | Uso |
|---|---|
| **React Native** + **Expo SDK 53** | Framework mobile |
| **Expo Router** | Navegação file-based |
| **TypeScript** | Tipagem estática |
| **Context API** | Gerenciamento de estado |
| **Axios** | Cliente HTTP (com interceptor JWT) |
| **Firebase Auth** | Autenticação (login/cadastro) |
| **AsyncStorage** | Persistência local (carrinho) |
| **Lucide React Native** | Ícones |

## 📂 Estrutura do Projeto

```
ACHÔ/
├── app/                      # Telas (Expo Router - file-based routing)
│   ├── (tabs)/               # Tab navigation principal
│   │   ├── _layout.tsx       #   Layout das tabs
│   │   ├── index.tsx         #   🏠 Home — catálogo de lojas
│   │   ├── favorites.tsx     #   ❤️ Favoritos
│   │   ├── cart.tsx          #   🛒 Carrinho
│   │   └── profile.tsx      #   👤 Perfil
│   ├── auth/                 # Fluxo de autenticação
│   │   ├── index.tsx         #   Tela de boas-vindas
│   │   ├── login.tsx         #   Login
│   │   └── register.tsx      #   Cadastro
│   ├── store/[id].tsx        # Detalhes de uma loja
│   ├── checkout.tsx          # Finalização de pedido
│   ├── order/[id].tsx        # Acompanhamento de pedido
│   ├── profile/              # Subpáginas de perfil
│   │   ├── edit.tsx          #   Editar dados
│   │   ├── orders.tsx        #   Histórico de pedidos
│   │   ├── settings.tsx      #   Configurações
│   │   └── help.tsx          #   Ajuda
│   ├── _layout.tsx           # Layout raiz (providers, auth guard)
│   └── +not-found.tsx        # Página 404
│
├── components/               # Componentes reutilizáveis
│   ├── CategoryFilter.tsx    # Filtro por categoria de loja
│   ├── StoreCard.tsx         # Card de loja
│   ├── ErrorBoundary.tsx     # Captura de erros React
│   ├── NetworkStatus.tsx     # Monitoramento de conectividade
│   ├── SkeletonLoader.tsx    # Loading skeleton
│   ├── Toast.tsx             # Notificações toast
│   ├── EmptyState.tsx        # Estado vazio
│   └── LoadingSpinner.tsx    # Spinner de carregamento
│
├── contexts/                 # Gerenciamento de estado (Context API)
│   ├── AuthContext.tsx       # Autenticação (Firebase Auth + perfil via API)
│   ├── CartContext.tsx       # Carrinho de compras (AsyncStorage local)
│   └── FavoritesContext.tsx  # Lojas favoritas (sincronizado com API)
│
├── services/                 # Camada de comunicação com a API .NET
│   ├── api.ts               # Instância Axios + interceptor JWT
│   ├── firebase.ts          # Inicialização do Firebase (Auth only)
│   ├── storeService.ts      # Lojas e produtos (GET /api/lojas)
│   ├── orderService.ts      # Pedidos (GET/POST /api/pedidos)
│   ├── userService.ts       # Perfil do usuário (GET/PUT /api/usuarios/me)
│   └── favoritesService.ts  # Favoritos (GET/POST/DELETE /api/favoritos)
│
├── hooks/                    # Custom hooks
│   ├── useFrameworkReady.ts  # Expo framework ready
│   ├── useNetworkStatus.ts   # Status de rede
│   └── useToast.ts           # Controle de toasts
│
├── types/                    # Tipos TypeScript (alinhados com entidades C#)
│   ├── index.ts              # Usuario, Loja, Produto, Pedido, ItemPedido, etc.
│   └── env.d.ts              # Tipagem de variáveis de ambiente
│
├── utils/                    # Utilitários
│   ├── analytics.ts          # Sistema de analytics
│   ├── constants.ts          # Constantes globais
│   ├── permissions.ts        # Gerenciamento de permissões
│   ├── storage.ts            # Armazenamento seguro
│   └── validation.ts         # Validação e formatação
│
├── constants/                # Tokens de design
│   └── theme.ts              # Cores, espaçamentos, tipografia
│
├── assets/images/            # Imagens estáticas (icon, favicon)
├── app.json                  # Configuração do Expo
├── package.json              # Dependências e scripts
├── tsconfig.json             # Configuração TypeScript
└── .env.example              # Template de variáveis de ambiente
```

## 🔌 Endpoints consumidos (API .NET)

| Método | Endpoint | Serviço | Descrição |
|---|---|---|---|
| `GET` | `/api/lojas` | `storeService` | Lista lojas (paginado, filtro por categoria) |
| `GET` | `/api/lojas/:id` | `storeService` | Detalhes de uma loja |
| `GET` | `/api/lojas/:id/produtos` | `storeService` | Produtos de uma loja |
| `GET` | `/api/lojas/buscar` | `storeService` | Busca de lojas por termo |
| `GET` | `/api/pedidos` | `orderService` | Meus pedidos (paginado) |
| `POST` | `/api/pedidos` | `orderService` | Criar novo pedido |
| `GET` | `/api/pedidos/:id` | `orderService` | Detalhes de um pedido |
| `PATCH` | `/api/pedidos/:id/cancelar` | `orderService` | Cancelar pedido |
| `GET` | `/api/usuarios/me` | `userService` | Meu perfil |
| `PUT` | `/api/usuarios/me` | `userService` | Atualizar perfil |
| `GET` | `/api/favoritos` | `favoritesService` | Listar favoritos |
| `POST` | `/api/favoritos/:lojaId` | `favoritesService` | Adicionar favorito |
| `DELETE` | `/api/favoritos/:lojaId` | `favoritesService` | Remover favorito |

## 📦 Tipos do domínio (alinhados com C#)

Os tipos TypeScript refletem as entidades do backend .NET. Todos os IDs são `string` (Guid no C#) e datas são `string` ISO-8601.

| TypeScript | C# Entity | Descrição |
|---|---|---|
| `Usuario` | `Usuario` | Dados do perfil do usuário |
| `Loja` | `Loja` | Loja/comércio local |
| `Produto` | `Produto` | Produto de uma loja |
| `Pedido` | `Pedido` | Pedido completo com itens |
| `ItemPedido` | `ItemPedido` | Item dentro de um pedido |
| `StatusPedido` | `StatusPedido` | Enum de status do pedido |
| `CriarPedidoRequest` | DTO | Payload para criar pedido |
| `ItemCarrinho` | — | Estado local do carrinho |
| `ApiPaginada<T>` | — | Resposta paginada da API |

## 🚀 Como Iniciar

### Pré-requisitos
- **Node.js** 18+
- **npm** 9+ (ou yarn)
- **Expo Go** no celular (para teste) ou emulador Android/iOS
- **Backend .NET 8** rodando (para dados reais)

### Setup

```bash
# 1. Instalar dependências
npm install

# 2. Criar arquivo de ambiente
copy .env.example .env

# 3. Configurar o .env:
#    - EXPO_PUBLIC_API_URL → URL da API .NET (ex: http://192.168.x.x:5000 para emulador)
#    - EXPO_PUBLIC_FIREBASE_* → credenciais do seu projeto Firebase

# 4. Iniciar o servidor de desenvolvimento
npm run dev
```

> **⚠️ Emulador Android:** Use o IP da máquina (ex: `http://192.168.1.100:5000`) em vez de `localhost`, pois o emulador roda em uma VM separada.

Escaneie o QR code com o Expo Go ou pressione `w` para abrir no navegador.

### Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Inicia o Expo dev server |
| `npm run build:web` | Exporta o app para web |
| `npm run build:android` | Build Android via EAS |
| `npm run build:ios` | Build iOS via EAS |
| `npm run type-check` | Verifica tipos TypeScript |
| `npm run lint` | Linter do Expo |
| `npm test` | Executa testes com Jest |

## ✅ Status Atual

O app está preparado para consumir a **API .NET 8** em produção. Funcionalidades implementadas:

- 🔐 **Autenticação** — login e cadastro via Firebase Auth (email/senha)
- 🏪 **Catálogo** — busca, filtros por categoria, lojas favoritas (API)
- 🛒 **Carrinho** — adicionar/remover itens, ajuste de quantidade (AsyncStorage local)
- 📦 **Pedidos** — checkout completo, acompanhamento de status (API)
- 👤 **Perfil** — edição de dados via API, histórico de pedidos
- ❤️ **Favoritos** — sincronizados com o backend (atualização otimista)
- 🔑 **Interceptor JWT** — token Firebase injetado automaticamente em todas as requests
- 🎨 **UI** — design responsivo, skeleton loaders, toasts, animações

## 🔮 Próximos Passos

- [ ] Notificações push
- [ ] Geolocalização para lojas próximas
- [ ] Sistema de avaliações
- [ ] Chat com lojistas
- [ ] Programa de fidelidade
- [ ] Painel administrativo para lojistas
- [ ] Upload de foto de perfil

## 📄 Licença

MIT — veja o arquivo [LICENSE](LICENSE) para detalhes.