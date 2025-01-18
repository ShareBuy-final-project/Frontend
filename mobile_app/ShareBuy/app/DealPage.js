import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native'; // For route parameters
import Icon from 'react-native-vector-icons/MaterialIcons'; // For the button icons

const DealPage = () => {
  const route = useRoute();
  const { dealName } = route.params; // Get the deal name passed from Home
  const [dealDetails, setDealDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInGroup, setIsInGroup] = useState(false); // Track if the user is part of a group
  const [favorites, setFavorites] = useState([]); // Track favorite deals

  useEffect(() => {
    const fetchDealDetails = async () => {
      setIsLoading(true);
      // Simulate API call to fetch deal details based on dealName
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay

      // Simulated fetched deal details
      setDealDetails({
        name: dealName,
        description: 'This is a detailed description of the deal. A great deal for bulk purchases.',
        price: '$50',
        originalPrice: '$100',
        image: 'https://via.placeholder.com/150', // Placeholder image
        participants: '3/10', // Simulated number of participants
      });
      setIsLoading(false);
    };

    fetchDealDetails();
  }, [dealName]);

  const handleJoinGroup = () => {
    setIsInGroup(true);
  };

  const handleLeaveGroup = () => {
    setIsInGroup(false);
  };

  const toggleFavorite = (dealId) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(dealId)
        ? prevFavorites.filter((id) => id !== dealId)
        : [...prevFavorites, dealId]
    );
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#f08080" />;
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: dealDetails?.image }} style={styles.image} />
      {/* Heart Icon */}
      <TouchableOpacity
        style={styles.heartButton}
        onPress={() => toggleFavorite(dealName)} // Use the deal name or unique id for this
      >
        <Icon
          name={favorites.includes(dealName) ? 'favorite' : 'favorite-border'}
          size={28} 
          color="#f08080"
        />
      </TouchableOpacity>
      <View style={styles.participantOverlay}>
          <Text style={styles.participantText}>{dealDetails.participants}</Text>
        </View>
      <Text style={styles.title}>{dealDetails?.name}</Text>
      <Text style={styles.description}>{dealDetails?.description}</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>Price: {dealDetails?.price}</Text>
        <Text style={styles.originalPrice}>Original Price: {dealDetails?.originalPrice}</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f9f9f9',
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
