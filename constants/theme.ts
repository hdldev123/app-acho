// ============================================================
// Design Tokens — Paleta de cores, tipografia e espaçamentos
// ============================================================

export const COLORS = {
  // Primária (rosa/vermelho — brand color do ACHÔ)
  primary: '#E11D48',
  primaryLight: '#FB7185',
  primaryDark: '#BE123C',

  // Neutros
  white: '#FFFFFF',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  border: '#E5E7EB',
  divider: '#F3F4F6',

  // Texto
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Feedback
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Categorias (usadas nos filtros de lojas)
  categoryPadaria: '#F59E0B',
  categoryMercado: '#10B981',
  categoryFarmacia: '#3B82F6',
  categoryRestaurante: '#E11D48',
  categoryPapelaria: '#8B5CF6',
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const FONT_SIZE = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 22,
  xxxl: 28,
  title: 32,
} as const;

export const FONT_WEIGHT = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const BORDER_RADIUS = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
} as const;
