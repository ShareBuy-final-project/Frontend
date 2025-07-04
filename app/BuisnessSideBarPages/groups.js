import React, { useState, useEffect, useCallback } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';
import BaseLayout from '../BaseLayout';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'; // For navigation
import { COLORS, FONT } from '../../constants/theme';
import {getBuisnessCurrentGroups, saveGroup, unSaveGroup} from '../../apiCalls/groupApiCalls'
import { getToken } from '../../utils/userTokens';
import debounce from 'lodash/debounce';
import DefaultPic from '../../assets/images/default_pic.png';


const Groups = () => {
  const [deals, setDeals] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isBusiness, setIsBusiness] = useState(false);

  const navigation = useNavigation(); // Use navigation for page transition

  const toggleFavorite = async (dealId) => {
    setFavorites((prevFavorites) => {
      const isFavorited = prevFavorites.includes(dealId);
      const newFavorites = isFavorited
        ? prevFavorites.filter((id) => id !== dealId)
        : [...prevFavorites, dealId];
  
      // Call saveGroup or unSaveGroup based on whether the deal is being added or removed from favorites
      if (isFavorited) {
        unSaveGroup(dealId)  // Call unSaveGroup when unfavoriting
          .catch(error => console.error('Error unsaving group:', error));
      } else {
        saveGroup(dealId)  // Call saveGroup when favoriting
          .catch(error => console.error('Error saving group:', error));
      }
  
      return newFavorites;
    });
  };
  
  const getDeals = async () => {
    setIsLoading(true);
    //setDeals([]); // Clear the deals before fetching new ones
    try {
      // Call the API fetchDeals function
      const apiDeals = await getBuisnessCurrentGroups(page, 10); 
      if (apiDeals.length === 0) {
        setHasMore(false); // No more deals available
        return;
      }  
      // Map the API response to match your component's requirements
      const formattedDeals = apiDeals.map((deal) => ({
        id: deal.id,
        title: `${deal.name}`,
        original_price: `$${deal.price}`,
        discounted_price: `$${deal.discount}`,
        image: deal.imageBase64, // Default placeholder image
        participants: deal.totalAmount || 0, // Participant count from API
        size: deal.size,
        isSaved: deal.isSaved || false,
      }));

      // Update favorites based on the deals received
      const initialFavorites = formattedDeals.filter(deal => deal.isSaved).map(deal => deal.id);
      setFavorites(initialFavorites);

      // Update the state with the new deals
      setDeals((prevDeals) => [...prevDeals, ...formattedDeals]);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchIsBusiness = async () => {
      const value = await getToken('isBusiness');
      setIsBusiness(value === 'true');
    };
    fetchIsBusiness();
  }, []);


  useEffect(() => {
    getDeals();
  }, [page]);

  const debouncedGetDeals = useCallback(
    debounce(() => {
      if (page !== 1) {
        setPage(1);
      } else {
        getDeals();
      }
    }, 300),
    [page]
  );
  
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
    };

    const renderDealCard = ({ item }) => (
      <TouchableOpacity style={[styles.card,{ width: deals.length === 1 ? '100%' : '48%' } ]}   onPress={() => navigation.navigate('DealPage', { dealId: item.id })}>
        <View style={styles.imageContainer}>
        <Text>{console.log(item?.image)}</Text>
        <Image source={item?.image ? { uri: item.image } : DefaultPic} style={styles.cardImage} resizeMode="contain"/>
          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => toggleFavorite(item.id)}
          >
            <Icon
              name={favorites.includes(item.id) ? 'favorite' : 'favorite-border'}
              size={24}
              color="#f08080"
            />
          </TouchableOpacity>
          <View style={styles.participantOverlay}>
            <Text style={styles.participantText}>{item.participants}/{item.size}</Text>
          </View>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.cardPriceOriginal}>{item.original_price}</Text>
          <Text style={styles.cardPriceDiscounted}>{item.discounted_price}</Text>
        </View>
      </TouchableOpacity>
    );
    
  return (
    <BaseLayout>
      <View style={styles.DealsContainer}>
        {deals.length === 0 && !isLoading ? (
          <Text style={styles.noDealsText}>You have not created any purchasing groups yet!</Text>
        ) : (
          <FlatList
            data={deals}
            renderItem={renderDealCard}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            key={'grid'}
            contentContainerStyle={styles.listContainer}
            numColumns={2}
            columnWrapperStyle={styles.row}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isLoading && <Text style={styles.loadingText}>Loading more deals...</Text>}
          />
        )}
      </View>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f08080',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff7f50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
  },
  DealsContainer: {
    marginTop: -10,
    alignItems: 'center', 
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: '48%',
  },
  imageContainer: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: 150,
    marginTop: 10
  },
  participantOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 30,
    alignItems: 'center',
  },
  participantText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    margin: 10,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  cardPriceOriginal: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through', // Add red line through original price
    alignSelf: 'center', // Align it vertically with the discounted price
  },
  cardPriceDiscounted: {
    fontSize: 14,
    color: '#f08080', // Discounted price color (can adjust as needed)
    fontWeight: 'bold',
    alignSelf: 'center', // Align vertically with the original price
  },
  loadingText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#888',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    padding: 6,
  },
  messageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  secondSubMessage: {
    fontSize: 14,
    color: COLORS.black,
    textAlign: 'center',
    fontFamily: FONT.arial,
    backgroundColor: COLORS.glowingYeloow,
  },
  noDealsText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#888',
    fontSize: 16,
  },
});

export default Groups;
