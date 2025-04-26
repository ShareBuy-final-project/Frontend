import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';
import BaseLayout from './BaseLayout';
import SearchBar from '../components/SearchBar';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT } from '../constants/theme';
import {fetchDeals, saveGroup, unSaveGroup, fetchCategories} from '../apiCalls/groupApiCalls'
import { getToken } from '../utils/userTokens';
import debounce from 'lodash/debounce';
import DefaultPic from '../assets/images/default_pic.png';
import DropDown from '../components/DropDown'; // Import the generic DropDown component

const Home = () => {
  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]); // State to store categories
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [isBusiness, setIsBusiness] = useState(false);
  const searchTimer = useRef(null);
  const isFirstRenderSearchQuery = useRef(true);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  const navigation = useNavigation();

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

  const fetchCategoriesFromAPI = async () => {
    try {
      const data = await fetchCategories(); // Use the new fetchCategories function
      console.log('Fetched categories:', data);

      // Sort categories alphabetically and prepend "All Categories"
      const sortedCategories = data.sort((a, b) => a.localeCompare(b));
      setCategories([{ label: 'All Categories', value: '' }, ...sortedCategories.map((category) => ({ label: category, value: category }))]);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchCategoriesFromAPI(); // Fetch categories on component mount
  }, []);

  const getDeals = async () => {
    setIsLoading(true);
    try {
      // Prepare filters dynamically
      const filters = { text: searchQuery };
      if (selectedCategory) {
        filters.category = selectedCategory;
      }

      // Call the API fetchDeals function with filters and pagination
      console.log('Fetching deals with filters:', filters);
      const apiDeals = await fetchDeals(filters, page, 10);

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

  const handleSearchChange = (query) => {
    if (searchTimer.current) {
      clearTimeout(searchTimer.current);
    }

    setSearchQuery(query);
    searchTimer.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 250);
  };

  // Add this effect to watch for debouncedQuery changes
  useEffect(() => {
    if (isFirstRenderSearchQuery.current) {
      isFirstRenderSearchQuery.current = false;
    } else {
      setDeals([]);
      if (page !== 1) {
        setPage(1);
      } else {
        getDeals();
      }
    }
  }, [debouncedQuery, selectedCategory]);

  // Clean up timer when component unmounts
  useEffect(() => {
    return () => {
      if (searchTimer.current) {
        clearTimeout(searchTimer.current);
      }
    };
  }, []);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const renderDealCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { width: deals.length === 1 ? '100%' : '48%' }]}
      onPress={() => navigation.navigate('DealPage', { dealId: item.id })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={item?.image ? { uri: item.image } : DefaultPic}
          style={styles.cardImage}
          resizeMode="contain"
        />
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
          <Text style={styles.participantText}>
            {item.participants}/{item.size}
          </Text>
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
      <View style={styles.messageContainer}>
        <Text style={styles.secondSubMessage}>
          {isBusiness ? 'Want to create a new deal? ' : 'Want to create a new suggested deal? '}
          <Text
            style={{ color: COLORS.black, textDecorationLine: 'underline', fontWeight: 'bold' }}
            onPress={() => navigation.navigate(isBusiness ? 'NewDealBasics' : 'suggestedDeal')}
          >
            Create one
          </Text>
        </Text>
      </View>
      <View style={styles.DealsContainer}>
        <SearchBar value={searchQuery} onChangeText={handleSearchChange} />
        <DropDown
          placeholder="filter by category"
          marginTop={-5}
          marginBottom={10}
          selectedValue={selectedCategory}
          onValueChange={handleCategoryChange}
          options={categories}
          width="90%"
        />
        {deals.length === 0 && !isLoading ? (
          <Text style={styles.noDealsText}>No deals found for the search query.</Text>
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
    alignItems: 'center', // Center the SearchBar
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
    marginTop: 10,
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

export default Home;