import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, Alert, Image, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation, useRoute } from '@react-navigation/native';
import BaseLayout from './BaseLayout';
import * as ImagePicker from 'expo-image-picker';
import { createGroup } from '../apiCalls/groupApiCalls';

const NewDealDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { dealName, amountBefore, amountAfter, minimumAmount } = route.params;
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(null);
  const [image, setImage] = useState(null);

  const handleDone = async () => {
    if (!description) {
      Alert.alert('Invalid Input', 'Deal Name field must be filled in.'); 
    } else {
      try {
        await createGroup({
          name: dealName,
          description,
          image,
          price: amountBefore,
          discount: amountAfter,
          size: minimumAmount
        });
        Alert.alert('Success', 'Your deal has been submitted!');
        navigation.navigate('home', {});
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    }
  };

  const saveImage = async (image) => {
    try {
      setImage(image);
    } catch (error) {
      console.error('Error saving image:', error);
      Alert.alert('Error', 'Failed to save image. Please try again.');
    }
  };

  const handleTakePicture = async () => {
    try {
      await ImagePicker.getCameraPermissionsAsync();
      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.Front,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.cancelled) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }
  };

  const handleGalleryPicture = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.cancelled) {
        await saveImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('ImagePicker Error:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handlePictureOption = () => {
    Alert.alert(
      'Upload Picture',
      'Choose an option',
      [
        { text: 'Take a Picture', onPress: handleTakePicture, style: 'default', textAlign: 'center' },
        { text: 'Upload from Gallery', onPress: handleGalleryPicture, style: 'default', textAlign: 'center' },
        { text: 'Cancel', style: 'cancel', textAlign: 'center' },
      ],
      { cancelable: true, textAlign: 'center' }
    );
  };

  return (
    <BaseLayout>
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={styles.innerContainer}>
            <Text style={styles.header}>
              Add more details about your deal
            </Text>
            <View key="descriptionWrapper" style={styles.inputWrapper}>
              <TextInput
                style={styles.descriptionInput}
                placeholder="Enter deal description"
                multiline={true}
                numberOfLines={4}
                placeholderTextColor={COLORS.gray}
                value={description}
                onChangeText={setDescription}
              />
              <Text style={styles.mandatory}>*</Text>
            </View>
            <View key="imagePreviewWrapper" style={styles.imagePreviewWrapper}>
              {image ? (
                <Image source={{ uri: image }} style={styles.imagePreview} />
              ) : (
                <Text style={styles.infoText}>No image uploaded yet</Text>
              )}
            </View>
            <View key="pictureWrapper" style={styles.inputWrapper}>
              <TouchableOpacity style={styles.uploadButton} onPress={handlePictureOption}>
                <Text style={styles.uploadText}>Upload Deal image</Text>
                <Icon name="upload" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer} key="doneButtonWrapper">
              <TouchableOpacity style={styles.nextButton} onPress={handleDone}>
                <Text style={styles.buttonText}>Done</Text>
                <Icon name="check" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </BaseLayout>
  );
};

const styles = StyleSheet.create({

  innerContainer: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 40,
    color: COLORS.black,
    textAlign: 'center',
    fontFamily: FONT.arialBold,
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    marginTop: 20,
  },
  mandatory: {
    color: 'red',
    marginLeft: 5,
    fontSize: 18,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  uploadText: {
    color: COLORS.white,
    fontSize: 16,
    marginRight: 10,
    textAlign: 'center',
  },
  imagePreview: {
    width: 150,
    height: 150,
    marginTop: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    alignSelf: 'center',
    width: '50%',
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: COLORS.black,
    borderRadius: 5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.black,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '100%',  
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: FONT.arialBold,
    textAlign: 'center',  
    paddingRight: 10,
  },
  descriptionInput: {
    height: 150,  
    textAlignVertical: 'top',  
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.black,
    borderRadius: 5,
  },
  imagePreviewWrapper: {
    alignItems: 'center',
    marginVertical: 20,
  },
  infoText: {
    color: COLORS.gray,
    fontSize: 16,
    textAlign: 'center',
  },
});
export default NewDealDetails;
