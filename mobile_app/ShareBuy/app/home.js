import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';
import BaseLayout from './BaseLayout'; // Adjust the path based on your folder structure

const Home = () => {
  const [deals, setDeals] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Mock API call to fetch deals
  const fetchDeals = async (pageNumber) => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Generate mock data
    const newDeals = Array.from({ length: 10 }, (_, index) => ({
      id: `deal-${pageNumber}-${index + 1}`,
      title: `Deal ${index + 1 + (pageNumber - 1) * 10}`,
      price: `$${(Math.random() * 100).toFixed(2)}`,
      image: 'https://via.placeholder.com/150', // Placeholder image
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
      <Image source={{ uri: item.image }} style={styles.cardImage} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <BaseLayout>
      <FlatList
        data={deals}
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
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
  },
  row: {
    justifyContent: 'space-between', // Space evenly between items in a row
    marginBottom: 15, // Add spacing between rows
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
    width: '48%', // Adjust width to fit two cards per row with spacing
  },
  cardImage: {
    width: '100%',
    height: 150,
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
});

export default Home;
