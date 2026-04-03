import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  RefreshControl,
} from 'react-native';
import { ArrowLeft, Clock, CircleCheck as CheckCircle, Truck, Package, ShoppingBag } from 'lucide-react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { getMeusPedidos, StatusPedido } from '@/services/orderService';
import { Pedido } from '@/types';
import LoadingSpinner from '@/components/LoadingSpinner';

const ORDER_STATUS_CONFIG = {
  [StatusPedido.PENDENTE]: {
    icon: Clock,
    color: '#F59E0B',
    title: 'Aguardando',
  },
  [StatusPedido.CONFIRMADO]: {
    icon: CheckCircle,
    color: '#10B981',
    title: 'Confirmado',
  },
  [StatusPedido.PREPARANDO]: {
    icon: Package,
    color: '#3B82F6',
    title: 'Preparando',
  },
  [StatusPedido.SAIU_PARA_ENTREGA]: {
    icon: Truck,
    color: '#8B5CF6',
    title: 'A caminho',
  },
  [StatusPedido.ENTREGUE]: {
    icon: CheckCircle,
    color: '#10B981',
    title: 'Entregue',
  },
  [StatusPedido.CANCELADO]: {
    icon: Clock,
    color: '#EF4444',
    title: 'Cancelado',
  },
};

export default function OrderHistoryScreen() {
  const { usuario } = useAuth();
  const [orders, setOrders] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (usuario) {
      loadOrders();
    }
  }, [usuario]);

  const loadOrders = async () => {
    if (!usuario) return;

    try {
      const result = await getMeusPedidos();
      setOrders(result.itens);
    } catch (error) {
      console.error('Erro ao carregar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date(dateStr));
  };

  const handleOrderPress = (orderId: string) => {
    router.push(`/order/${orderId}`);
  };

  if (loading) {
    return <LoadingSpinner text="Carregando pedidos..." />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.title}>Meus Pedidos</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <ShoppingBag size={64} color="#E5E7EB" />
          <Text style={styles.emptyTitle}>Nenhum pedido ainda</Text>
          <Text style={styles.emptyText}>
            Quando você fizer seu primeiro pedido, ele aparecerá aqui!
          </Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => router.push('/(tabs)/')}
          >
            <Text style={styles.shopButtonText}>Explorar Lojas</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {orders.map((order) => {
            const statusConfig = ORDER_STATUS_CONFIG[order.status];
            const StatusIcon = statusConfig.icon;

            return (
              <TouchableOpacity
                key={order.id}
                style={styles.orderCard}
                onPress={() => handleOrderPress(order.id)}
              >
                <View style={styles.orderHeader}>
                  <View style={styles.orderInfo}>
                    <Text style={styles.orderId}>Pedido #{order.id.slice(-6)}</Text>
                    <Text style={styles.orderDate}>{formatDate(order.criadoEm)}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusConfig.color }]}>
                    <StatusIcon size={16} color="#FFFFFF" />
                    <Text style={styles.statusText}>{statusConfig.title}</Text>
                  </View>
                </View>

                <View style={styles.storeInfo}>
                  <Text style={styles.storeName}>{order.nomeLoja}</Text>
                </View>

                <View style={styles.orderSummary}>
                  <Text style={styles.itemsCount}>
                    {order.itens.length} {order.itens.length === 1 ? 'item' : 'itens'}
                  </Text>
                  <Text style={styles.orderTotal}>{formatPrice(order.total)}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  storeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  storeImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  itemsCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E11D48',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  shopButton: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shopButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});