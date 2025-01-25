import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import { useRoute,useNavigation } from '@react-navigation/native'; // For route parameters
import Icon from 'react-native-vector-icons/MaterialIcons'; // For the button icons
import BaseLayout from './BaseLayout';
import {getGroupById, joinGroup, leaveGroup} from '../apiCalls/groupApiCalls'
import DefaultPic from '../assets/images/default_pic.png';

const DealPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { dealId } = route.params; // Get the deal id passed from Home
  const [dealDetails, setDealDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInGroup, setIsInGroup] = useState(false); // Track if the user is part of a group
  const [favorites, setFavorites] = useState([]); // Track favorite deals

  useEffect(() => {
    const fetchDealDetails = async () => {
      setIsLoading(true);
      try {
        // Fetch group details using the dealId
        const group = await getGroupById(dealId);
        setDealDetails({
          id: group.id,
          title: `${group.name}`,
          original_price: `$${group.price}`,
          discounted_price: `$${group.discount}`,
          image: group.imageBase64, // The backend now sends the complete base64 string
          participants: group.totalAmount || 0, // Participant count from API
          size: group.size,
          description: group.description,
          isSaved: group.isSaved || false
        });
      } catch (error) {
        console.error('Error fetching deal details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDealDetails();
  }, [dealId]);

  const handleJoinGroup = () => {
    navigation.navigate('CheckoutScreen', {
      title: dealDetails.title,
      price: dealDetails.discounted_price,
      description: dealDetails.description,
      groupId: dealDetails.id});
    setIsInGroup(true);
  };

  const handleLeaveGroup = () => {
    Alert.alert(
      'Confirm Exit',
      'Are you sure you want to leave this group? You will no longer be a part of this deal.',
          [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => setIsInGroup(false),
        },
      ],
      { cancelable: true }
    );
  };

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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f08080" />
      </View>
    );    
  }

  //console.log(dealDetails)
  return (
    <BaseLayout>
    <View style={styles.container}>
    <Image source={dealDetails?.image ? { uri: dealDetails.image } : DefaultPic} style={styles.image} resizeMode="contain"/>
      {/* Heart Icon */}
      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => toggleFavorite(dealDetails?.id)} // Use the deal name or unique id for this
      >
        <Icon
          name={favorites.includes(dealDetails?.id) ? 'favorite' : 'favorite-border'}
          size={28} 
          color="#f08080"
        />
      </TouchableOpacity>
      <View style={styles.participantOverlay}>
          <Text style={styles.participantText}>{dealDetails?.participants}/{dealDetails?.size}</Text>
        </View>
      <Text style={styles.title}>{dealDetails?.title}</Text>
      <Text style={styles.description}>{dealDetails?.description}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>Price: {dealDetails?.discounted_price}</Text>
        <Text style={styles.originalPrice}>Original Price: {dealDetails?.original_price}</Text>
      </View>

      {/* Participants Circle */}
      {/* Join/Leave Group Button */}
      <View style={styles.buttonContainer}>
        {isInGroup ? (
          <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveGroup}>
            <Icon name="group-remove" size={24} color="#fff" />
            <Text style={styles.buttonText}>Leave Group</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.joinButton} onPress={handleJoinGroup}>
            <Icon name="group-add" size={24} color="#fff" />
            <Text style={styles.buttonText}>Join Group</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f9f9f9',
    width: '100%'
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center',      
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginVertical: 10,
    lineHeight: 22,
  },
  priceContainer: {
    marginVertical: 10,
  },
  price: {
    fontSize: 18,
    color: '#f08080',
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 16,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  participantOverlay: {
    position: 'absolute',
    top: 20,
    right: 20,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  joinButton: {
    backgroundColor: '#4caf50',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '48%',
    justifyContent: 'center',
  },
  leaveButton: {
    backgroundColor: '#f44336',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: '48%',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    marginLeft: 5,
    fontSize: 16,
  },
  heartButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 10,
  },
});

export default DealPage;
