import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { getRecommendedGroups } from '../apiCalls/groupApiCalls';
import DefaultPic from '../assets/images/default_pic.png';

const screenWidth = Dimensions.get('window').width;

const RecommendationsBanner = ({ navigation }) => {
  const [recommendedDeals, setRecommendedDeals] = useState([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const recommendations = await getRecommendedGroups();
        setRecommendedDeals(recommendations);
      } catch (error) {
        console.error("Error fetching recommendations:", error);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>For You</Text>
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
                resizeMode="cover"
              />
              {deal.participants !== undefined && deal.size && (
                <View style={styles.overlay}>
                  <Text style={styles.overlayText}>{deal.participants}/{deal.size}</Text>
                </View>
              )}
            </View>
            <Text style={styles.dealTitle} numberOfLines={1}>{deal.name}</Text>
            <Text style={styles.discountedPrice}>${deal.discount}</Text>
            {deal.price && (
              <Text style={styles.originalPrice}>${deal.price}</Text>
            )}
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
    // paddingHorizontal: 10,
    marginVertical: 10,
    marginHorizontal: 15,
    backgroundColor: '#ededed',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    maxHeight: 190, 
    width: '100%'
  },
  scrollContent: {
    // paddingHorizontal: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 5,
  },
  card: {
    width: screenWidth * 0.32,
    marginRight: 12,
    // marginLeft: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
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
  },
  overlayText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  dealTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 5,
  },
  discountedPrice: {
    fontSize: 13,
    color: '#f08080',
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
  },
});

export default RecommendationsBanner;
