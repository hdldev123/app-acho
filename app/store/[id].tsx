import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import { ArrowLeft, Star, Clock, MapPin, Phone, Plus, Heart } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getLojaById } from '@/services/storeService';
import { Loja, Produto } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function StoreDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addToCart } = useCart();
  const { favorites, toggleFavorite } = useFavorites();
  const [store, setStore] = useState<Loja | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadStore();
    }
  }, [id]);

  const loadStore = async () => {
    try {
      const storeData = await getLojaById(id!);
      setStore(storeData);
    } catch (error) {
      console.error('Erro ao carregar loja:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados da loja.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Produto) => {
    if (!store) return;

    addToCart({
      produtoId: product.id,
      lojaId: store.id,
      nomeLoja: store.nome,
      nomeProduto: product.nome,
      imagemUrl: product.imagemUrl,
      preco: product.preco,
    });

    Alert.alert('Adicionado!', `${product.nome} foi adicionado ao carrinho.`);
  };

  const handleFavoritePress = () => {
    if (store) {
      toggleFavorite(store.id);
    }
  };

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  if (loading) {
    return <LoadingSpinner text="Carregando loja..." />;
  }

  if (!store) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Loja não encontrada</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isFavorite = favorites.includes(store.id);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.headerImageContainer}>
          <Image source={{ uri: store.imagemUrl }} style={styles.headerImage} />
          
          {/* Header Controls */}
          <View style={styles.headerControls}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleFavoritePress}
            >
              <Heart 
                size={24} 
                color={isFavorite ? "#E11D48" : "#FFFFFF"}
                fill={isFavorite ? "#E11D48" : "transparent"}
              />
            </TouchableOpacity>
          </View>

          {/* Store Status */}
          {!store.estaAberta && (
            <View style={styles.closedBanner}>
              <Text style={styles.closedBannerText}>Loja Fechada</Text>
            </View>
          )}
        </View>

        {/* Store Info */}
        <View style={styles.storeInfo}>
          <Text style={styles.storeName}>{store.nome}</Text>
          <Text style={styles.storeDescription}>{store.descricao}</Text>
          
          <View style={styles.storeDetails}>
            <View style={styles.detail}>
              <Star size={16} color="#FCD34D" fill="#FCD34D" />
              <Text style={styles.detailText}>{store.avaliacao} estrelas</Text>
            </View>
            
            <View style={styles.detail}>
              <Clock size={16} color={store.estaAberta ? "#10B981" : "#EF4444"} />
              <Text style={[
                styles.detailText,
                { color: store.estaAberta ? "#10B981" : "#EF4444" }
              ]}>
                {store.estaAberta ? "Aberto agora" : "Fechado"}
              </Text>
            </View>
          </View>

          <View style={styles.contactInfo}>
            <View style={styles.detail}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.detailText}>{store.endereco}</Text>
            </View>
            
            <View style={styles.detail}>
              <Phone size={16} color="#6B7280" />
              <Text style={styles.detailText}>{store.telefone}</Text>
            </View>
          </View>
        </View>

        {/* Products */}
        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Produtos</Text>
          
          {(store.produtos ?? []).length === 0 ? (
            <Text style={styles.emptyText}>Nenhum produto disponível</Text>
          ) : (
            <View style={styles.productsList}
            >
              {(store.produtos ?? []).map((product: Produto) => (
                <View key={product.id} style={styles.productCard}>
                  <Image source={{ uri: product.imagemUrl }} style={styles.productImage} />
                  
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{product.nome}</Text>
                    <Text style={styles.productDescription} numberOfLines={2}>
                      {product.descricao}
                    </Text>
                    <Text style={styles.productPrice}>{formatPrice(product.preco)}</Text>
                  </View>

                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      !store.estaAberta && styles.addButtonDisabled
                    ]}
                    onPress={() => handleAddToCart(product)}
                    disabled={!store.estaAberta}
                  >
                    <Plus size={20} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  headerImageContainer: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  headerControls: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedBanner: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(239,68,68,0.9)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  closedBannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  storeInfo: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 16,
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  storeDescription: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    marginBottom: 16,
  },
  storeDetails: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#1F2937',
    marginLeft: 6,
    fontWeight: '500',
  },
  contactInfo: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  productsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 40,
  },
  productsList: {
    gap: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E11D48',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E11D48',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#E11D48',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});