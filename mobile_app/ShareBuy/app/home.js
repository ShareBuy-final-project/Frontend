import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';
import BaseLayout from './BaseLayout';
import SearchBar from '../components/SearchBar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native'; // For navigation
import { COLORS, FONT } from '../constants/theme';

const Home = () => {
  const [deals, setDeals] = useState([]);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const navigation = useNavigation(); // Use navigation for page transition

  const toggleFavorite = (dealId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(dealId)
        ? prevFavorites.filter((id) => id !== dealId)
        : [...prevFavorites, dealId]
    );
  };

  const fetchDeals = async (pageNumber) => {
    setIsLoading(true);
    try {
      // Call the API fetchDeals function
      const apiDeals = await fetchDealsFromApi({}, pageNumber, 10, 'user@example.com'); // Replace 'user@example.com' with actual user email
      if (apiDeals.length === 0) {
        setHasMore(false); // No more deals available
        return;
      }  
      // Map the API response to match your component's requirements
      const formattedDeals = apiDeals.map((deal) => ({
        id: deal.id,
        title: deal.name,
        original_price: deal.original_price,
        discounted_price: deal.discounted_price,
        image: deal.image || 'https://via.placeholder.com/150', // Default placeholder image
        participants: deal.totalAmount || 0, // Participant count from API
      }));

      // Update the state with the new deals
      setDeals((prevDeals) => [...prevDeals, ...formattedDeals]);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch deals whenever the page changes
  useEffect(() => {
    fetchDeals(page);
  }, [page]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
    };

  const renderDealCard = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DealPage', { dealName: item.title })}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
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
          <Text style={styles.participantText}>{item.participants}</Text>
        </View>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.cardPriceOriginal}>{item.original_price}</Text>
        <Text style={styles.cardPriceDiscounted}>{item.descounted_price}</Text>
      </View>
    </TouchableOpacity>
  );

  const filteredDeals = deals.filter((deal) =>
    deal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <BaseLayout>
      <View style={styles.messageContainer}>
        <Text style={styles.secondSubMessage}>
          Want to create a new suggested deal? <Text style={{ color: COLORS.black, textDecorationLine: 'underline' }} onPress={() => navigation.replace('NewDealBasics')}>Create one</Text>
        </Text>
      </View>
      <View style={styles.DealsContainer}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <FlatList
          data={filteredDeals}
          renderItem={renderDealCard}
          keyExtractor={(item) => item.id}
          key={'grid'}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
          columnWrapperStyle={styles.row}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoading && <Text style={styles.loadingText}>Loading more deals...</Text>}
        />
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
});

export default Home;
