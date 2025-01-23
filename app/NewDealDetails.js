import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, TouchableOpacity, Alert, Image, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { COLORS, FONT } from '../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import BaseLayout from './BaseLayout';
import { launchImageLibrary } from 'react-native-image-picker';

const NewDealDetails = () => {
  const navigation = useNavigation();
  const [description, setDescription] = useState('');
  const [picture, setPicture] = useState(null);

  const handleDone = () => {
    if (!description) {
      Alert.alert('Invalid Input', 'Deal Name field must be filled in.'); 
    } else {
      // Handle navigation or submission
      Alert.alert('Success', 'Your deal has been submitted!');
      navigation.navigate('home', {});
    }
  };

  const handleUploadPicture = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',  // Allows only photo selection
        quality: 1,           // Set the image quality (1 is the best quality)
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          const source = { uri: response.assets[0].uri }; // Getting image URI
          setPicture(source); // Update state with selected image
        }
      }
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
            <View key="pictureWrapper" style={styles.inputWrapper}>
              <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPicture}>
                <Text style={styles.uploadText}>Upload Picture</Text>
                <Icon name="upload" size={20} color={COLORS.white} />
              </TouchableOpacity>
              {picture && <Image source={picture} style={styles.imagePreview} />}
            </View>
            <View style={[styles.buttonContainer]} key="doneButtonWrapper">
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
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    alignSelf: 'flex-end',
    width: '30%', 
    marginTop: 220,
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
});
export default NewDealDetails;
