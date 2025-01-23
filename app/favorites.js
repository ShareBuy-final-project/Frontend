import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import BaseLayout from './BaseLayout';  // Make sure to adjust the import based on your folder structure
import Icon from 'react-native-vector-icons/MaterialIcons';

const FavoritesPage = ({ favorites, deals, toggleFavorite }) => {
  // Filter to show only favorite deals
  const favoriteDeals = deals.filter(deal => favorites.includes(deal.id));

  // Render a favorite deal card
  const renderFavoriteCard = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <TouchableOpacity
          style={styles.heartButton}
          onPress={() => toggleFavorite(item.id)} // Toggle favorite status
        >
          <Icon name="favorite" size={24} color="#ff6b6b" />
        </TouchableOpacity>
      </View>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardPrice}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <BaseLayout>
      <View style={styles.container}>
        <Text style={styles.header}>Your Favorite Deals</Text>
        {favoriteDeals.length > 0 ? (
          <FlatList
            data={favoriteDeals}
            renderItem={renderFavoriteCard}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            numColumns={2}
            columnWrapperStyle={styles.row}
          />
        ) : (
          <Text style={styles.noFavoritesText}>No favorite deals yet. Start adding some!</Text>
        )}
      </View>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
  heartButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    zIndex: 10,
    padding: 6,
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
  noFavoritesText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});

export default FavoritesPage;
