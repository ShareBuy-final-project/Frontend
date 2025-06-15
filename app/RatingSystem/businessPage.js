import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, FlatList, Alert, Linking, Modal, Image, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getBusinessByNumber, submitReview } from '../../apiCalls/reviewApiCalls';
import { getToken } from '../../utils/userTokens'
import BaseLayout from '../BaseLayout';
import { fetchGroupsByBusiness, hasUserGroupWithBusiness } from '../../apiCalls/groupApiCalls';
import DefaultPic from '../../assets/images/default_pic.png';
const BusinessPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { businessNumber } = route.params || {};
  const [businessDetails, setBusinessDetails] = useState(null);
  const [businessEmail, setBusinessEmail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newReview, setNewReview] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [userEmail, setUserEmail] = useState('');
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [hasMoreGroups, setHasMoreGroups] = useState(true);
  const [reviewLimit, setReviewLimit] = useState(1); // Default to showing one review
  const [hasUserWithBusiness, setHasUserGroupWithBusiness] = useState(false);

  useEffect(() => {
    const fetchBusinessDetails = async () => {
      setIsLoading(true);
      try {
        const business = await getBusinessByNumber(businessNumber);
        setBusinessEmail(business.userEmail);
  
        const reviews = business.Reviews || [];
        const averageRating = reviews.length > 0
          ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
          : 0;
  
        setBusinessDetails({
          name: business.businessName,
          businessNumber: business.businessNumber,
          description: business.description,
          category: business.category,
          websiteLink: business.websiteLink,
          contactEmail: business.contactEmail,
          rating: Math.round(averageRating * 10) / 10,
          reviews: reviews,
        });
  
        const hasGroup = await hasUserGroupWithBusiness(businessNumber);
        setHasUserGroupWithBusiness(hasGroup);
  
      } catch (error) {
        console.error('Error fetching business details:', error);
      } finally {
        setIsLoading(false);
      }
    };
  
    const fetchEmail = async () => {
      const email = await getToken('email');
      setUserEmail(email);
    };
  
    fetchBusinessDetails();
    fetchEmail();
  }, [businessNumber]);
  
  useEffect(() => {
    if (!businessEmail) return;
    fetchGroups();
  }, [businessEmail]);
  useEffect(() => {
    if (!businessEmail) return;
    if (page > 1) {
      fetchGroups();
    }
  }, [page]);

  const fetchGroups = async () => {
    if (isLoadingGroups || !hasMoreGroups) return;

    setIsLoadingGroups(true);
    try {
      console.log('Fetching groups for business:', businessEmail, 'Page:', page);
      const fetchedGroups = await fetchGroupsByBusiness(businessEmail,page, 10);
      if (fetchedGroups.length === 0) {
        setHasMoreGroups(false);
        return;
      }

      const formattedGroups = fetchedGroups.map((group) => ({
        id: group.id,
        title: group.name,
        original_price: `$${group.price}`,
        discounted_price: `$${group.discount}`,
        image: group.imageBase64 || DefaultPic,
        participants: group.totalAmount || 0,
        size: group.size,
      }));

      setGroups((prevGroups) => [...prevGroups, ...formattedGroups]);
    } catch (error) {
      console.log('Error fetching groups:', error);
    } finally {
      setIsLoadingGroups(false);
    }
  };

  const addReview = async () => {
    if (newReview.trim() === '' || selectedRating === 0) {
      Alert.alert('Error', 'Please enter a review and select a rating');
      return;
    }

    try {
      const newReviewObj = {
        businessNumber: businessDetails.businessNumber,
        userEmail,
        rating: selectedRating,
        reviewText: newReview,
      };

      const savedReview = await submitReview(newReviewObj);

      const updatedReviews = [...businessDetails.reviews, savedReview];

      const newAverage = updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length;
    
      setBusinessDetails({
        ...businessDetails,
        reviews: updatedReviews,
        rating: Math.round(newAverage * 10) / 10,
      });
          setNewReview('');
      setSelectedRating(0);
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to submit review');
      console.error('Submit review error:', error);
    }
  };

   const renderDealCard = ({ item }) => (
      <TouchableOpacity
        style={[styles.card, { width: groups.length === 1 ? '100%' : '48%' }]}
        onPress={() => navigation.navigate('DealPage', { dealId: item.id })}
      >
        <View style={styles.imageContainer}>
          <Image source={item?.image ? { uri: item.image } : DefaultPic} style={styles.cardImage} resizeMode="contain" />
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

  if (isLoading || !businessDetails) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f08080" />
      </View>
    );
  }
  const handleLoadMore = () => {
    if (!isLoading && hasMoreGroups) setPage((prev) => prev + 1);
  };

    return (
      <BaseLayout>
        <FlatList
          ListHeaderComponent={
            <>
            <View style={styles.container}>
              <View style={styles.titleWithRating}>
                <Text style={styles.title}>{businessDetails?.name}</Text>
                <View style={styles.ratingContainer}>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <Icon
                      key={num}
                      name={num <= Math.round(businessDetails?.rating) ? 'star' : 'star-border'}
                      size={20}
                      color="#FFD700"
                    />
                  ))}
                  <Text style={styles.ratingCount}>({businessDetails?.reviews.length})</Text>
                </View>
              </View>
              <Text style={styles.category}>{businessDetails?.category}</Text>
              <Text style={styles.description}>{businessDetails?.description}</Text>

              {(businessDetails?.websiteLink || businessDetails?.contactEmail) && (
                <View style={styles.contactBox}>
                  <Text style={styles.contactHeading}>Contact Info</Text>

                  {businessDetails?.websiteLink && (
                    <TouchableOpacity
                      style={styles.contactRow}
                      onPress={() => Linking.openURL(businessDetails.websiteLink)}
                    >
                      <Icon name="language" size={18} color="#000" />
                      <Text style={styles.contactText}>Visit Website</Text>
                    </TouchableOpacity>
                  )}

                  {businessDetails?.contactEmail && (
                    <TouchableOpacity
                      style={styles.contactRow}
                      onPress={() => Linking.openURL(`mailto:${businessDetails.contactEmail}`)}
                    >
                      <Icon name="email" size={18} color="#000" />
                      <Text style={styles.contactText}>{businessDetails.contactEmail}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}

              <Text style={styles.reviewTitle}>Reviews:</Text>
              {businessDetails.reviews.slice(0, reviewLimit).map((item, index) => (
                <View key={index} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewUser}>{item.User?.fullName || item.userEmail}:</Text>
                    <View style={styles.starContainer}>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <Icon
                          key={num}
                          name={num <= item.rating ? 'star' : 'star-border'}
                          size={16}
                          color="#FFD700"
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{item.text || item.reviewText}</Text>
                </View>
              ))}

              {reviewLimit < businessDetails.reviews.length && (
                <TouchableOpacity onPress={() => setReviewLimit((prev) => prev + 2)}>
                  <Text style={styles.showMoreText}>Show More</Text>
                </TouchableOpacity>
              )}

              {reviewLimit > 1 && (
                <TouchableOpacity onPress={() => setReviewLimit(1)}>
                  <Text style={styles.showLessText}>Show Less</Text>
                </TouchableOpacity>
              )}

              {hasUserWithBusiness && 
              (<TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
                <Text style={styles.addButtonText}>Add Review</Text>
              </TouchableOpacity>)}

              <Modal visible={isModalVisible} animationType="slide" transparent>
                <TouchableOpacity
                  style={styles.modalContainer}
                  activeOpacity={1}
                  onPressOut={() => setIsModalVisible(false)}
                >
                  <TouchableOpacity
                    activeOpacity={1}
                    style={styles.modalContent}
                    onPress={() => {}}
                  >
                    <Text style={styles.modalTitle}>Write a Review</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Write your review..."
                      value={newReview}
                      onChangeText={setNewReview}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                    <Text style={styles.modalTitle}>Select Rating</Text>
                    <View style={styles.ratingSelect}>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <TouchableOpacity key={num} onPress={() => setSelectedRating(num)}>
                          <Icon name="star" size={30} color={selectedRating >= num ? '#FFD700' : '#ccc'} />
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
                        <Text style={styles.cancelText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.submitButton} onPress={addReview}>
                        <Text style={styles.submitText}>Submit</Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                </TouchableOpacity>
              </Modal>
              </View>
              <Text style={styles.sectionHeadline}>Browse {businessDetails?.name}'s Offers</Text>
              </>
           
          }
          data={groups}
          renderItem={renderDealCard}
          keyExtractor={(item, index) => `${item.id}_${index}`}
          numColumns={2} // Ensures two-column layout
          columnWrapperStyle={styles.row} // Adds spacing between columns
          contentContainerStyle={{
            paddingHorizontal: 10,
            marginTop: 40,
            flexGrow: 1,          // Ensures content stretches to fill space
            width: '100%'         // Ensures content fills entire screen width
          }} // Increased marginTop to 40 for more spacing
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={isLoadingGroups && <Text style={styles.loadingText}>Loading more deals...</Text>}
        />
      </BaseLayout>
    );
  };

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', width: '100%', marginBottom: 20, paddingBottom: 20 },

  title: { fontSize: 26, fontWeight: 'bold', color: '#333' },
  category: { fontSize: 18, color: '#666', marginBottom: 10 },
  titleWithRating: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginLeft: 10, 
  },
    ratingText: { fontSize: 16, fontWeight: 'bold', marginRight: 5 },
  description: { fontSize: 16, color: '#555', marginBottom: 10, lineHeight: 22 },
  website: { fontSize: 16, color: '#007bff', textDecorationLine: 'underline', marginBottom: 5 },
  contactBox: {
    backgroundColor: '#fafafa',
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  
  contactHeading: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '500',
  },
  
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  
  contactText: {
    fontSize: 15,
    color:  '#000',
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
  reviewTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  reviewItem: { backgroundColor: '#f1f1f1', padding: 10, borderRadius: 8, marginVertical: 5 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  reviewUser: { fontSize: 14, fontWeight: 'bold' },
  starContainer: { flexDirection: 'row' },
  reviewText: { fontSize: 14, color: '#333' },
  input: { height: 100, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, marginTop: 6 },
  addButton: { backgroundColor: '#f08080', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, marginTop: 15 },
  ratingSelect: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelButton: { padding: 10 },
  cancelText: { fontSize: 16, color: 'red' },
  submitButton: { backgroundColor: '#f08080', padding: 10, borderRadius: 5 },
  submitText: { color: '#fff', fontSize: 16 },
  card: { backgroundColor: '#fff', borderRadius: 8, marginBottom: 10, padding: 10, elevation: 2 },
  cardImage: { width: '100%', height: 150, borderRadius: 8 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 5 },
  priceContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  cardPriceOriginal: { fontSize: 14, color: '#888', textDecorationLine: 'line-through' },
  cardPriceDiscounted: { fontSize: 14, color: '#f08080', fontWeight: 'bold' },
  participantText: { fontSize: 12, color: '#666', marginTop: 5 },
  sectionHeadline: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: '#333' },
  scrollContainer: { paddingBottom: 20,
    backgroundColor: '#f9f9f9',
   },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  loadingText: { textAlign: 'center', padding: 10, color: '#666' },
  showMoreText: { color: '#007bff', textAlign: 'center', marginTop: 10, fontWeight: '500' },
  showLessText: { color: '#007bff', textAlign: 'center', marginTop: 10, fontWeight: '500' },
});

export default BusinessPage;
