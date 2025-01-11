import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';
import BaseLayout from './BaseLayout'; 
import SearchBar from '../components/SearchBar'; 
import Icon from 'react-native-vector-icons/MaterialIcons'; 

const Home = () => {
  const [deals, setDeals] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (dealId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(dealId)
        ? prevFavorites.filter((id) => id !== dealId)
        : [...prevFavorites, dealId]
    );
  };  

  // Mock API call to fetch deals
  const fetchDeals = async (pageNumber) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate mock data
    const newDeals = Array.from({ length: 10 }, (_, index) => ({
      id: `deal-${pageNumber}-${index + 1}-${Date.now()}`,
      title: `Deal ${index + 1 + (pageNumber - 1) * 10}`,
      price: `$${(Math.random() * 100).toFixed(2)}`,
      image: 'https://via.placeholder.com/150', // Placeholder image
      participants: `${Math.floor(Math.random() * 10) + 1}/10`, // Random participant count for demonstration
    }));

    setDeals((prevDeals) => [...prevDeals, ...newDeals]);
    setIsLoading(false);
  };

  // Fetch initial deals on component mount
  useEffect(() => {
    fetchDeals(page);
  }, [page]);

  // Load more deals when reaching the end of the list
  const handleLoadMore = () => {
    if (!isLoading) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  // Render a single deal card
  const renderDealCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
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
      <Text style={styles.cardPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  // Filter deals based on the search query
  const filteredDeals = deals.filter((deal) =>
    deal.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <BaseLayout>
      <View style={styles.DealsContainer}>
        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        <FlatList
          data={filteredDeals}
          renderItem={renderDealCard}
          keyExtractor={(item) => item.id}
          key={'grid'} // Force FlatList to re-render if necessary
          contentContainerStyle={styles.listContainer}
          numColumns={2} // Display 2 items per row
          columnWrapperStyle={styles.row} // Space between rows
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoading && <Text style={styles.loadingText}>Loading more deals...</Text>}
        />
      </View>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  DealsContainer: {
    marginTop: -30,
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
  cardPrice: {
    fontSize: 12,
    color: '#888',
    marginHorizontal: 10,
    marginBottom: 10,
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
});

export default Home;
