import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getRecommendedGroups, saveGroup, unSaveGroup } from '../apiCalls/groupApiCalls';
import DefaultPic from '../assets/images/default_pic.png';

const screenWidth = Dimensions.get('window').width;

const RecommendationsBanner = ({ navigation }) => {
  const [recommendedDeals, setRecommendedDeals] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const recommendations = await getRecommendedGroups();
        setRecommendedDeals(recommendations);
        const savedIds = recommendations.filter(deal => deal.isSaved).map(deal => deal.id);
        setFavorites(savedIds);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []);

  const toggleFavorite = async (dealId) => {
    const isFavorited = favorites.includes(dealId);
    const newFavorites = isFavorited
      ? favorites.filter((id) => id !== dealId)
      : [...favorites, dealId];

    setFavorites(newFavorites);

    if (isFavorited) {
      unSaveGroup(dealId).catch(error => console.error('Error unsaving group:', error));
    } else {
      saveGroup(dealId).catch(error => console.error('Error saving group:', error));
    }
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.titleRow}>
        <Image
          source={require('../assets/images/ai-logo.png')}
          style={styles.aiIcon}
        />
        <Text style={styles.title}>For You</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {recommendedDeals.map((deal) => (
          <TouchableOpacity
            key={deal.id}
            style={styles.card}
            onPress={() => navigation.navigate('DealPage', { dealId: deal.id })}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={deal.imageBase64 ? { uri: deal.imageBase64 } : DefaultPic}
                style={styles.image}
                resizeMode="contain"
              />
              <TouchableOpacity style={styles.heartButton} onPress={() => toggleFavorite(deal.id)}>
                <Icon
                  name={favorites.includes(deal.id) ? 'favorite' : 'favorite-border'}
                  size={18}
                  color="#f08080"
                />
              </TouchableOpacity>
              {deal.participants !== undefined && deal.size && (
                <View style={styles.overlay}>
                  <Text style={styles.overlayText}>{deal.participants}/{deal.size}</Text>
                </View>
              )}
            </View>
            <Text style={styles.dealTitle} numberOfLines={1}>{deal.name}</Text>
            <View style={styles.priceRow}>
              <Text style={styles.originalPrice}>${deal.price}</Text>
              {deal.price && (
                <Text style={styles.discountedPrice}>${deal.discount}</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: '100%',
  },
  wrapper: {
    padding: 10,
    marginVertical: 10,
    marginHorizontal: 15,
    backgroundColor: '#ededed',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    // maxHeight: 220,
    width: '100%'
  },
  scrollContent: {},
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  aiIcon: {
    width: 23,
    height: 23,
    marginRight: 5,
    marginBottom: 5
  },
  card: {
    width: screenWidth * 0.32,
    marginRight: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
    height: 150
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  overlay: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 10,
  },
  overlayText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  heartButton: {
    position: 'absolute',
    top: 5,
    left: 5,
    zIndex: 10,
  },
  dealTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 5,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  discountedPrice: {
    fontSize: 13,
    color: '#f08080',
    fontWeight: 'bold'
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
});

export default RecommendationsBanner;