import { useState } from "react";
import { SafeAreaView, ScrollView, Image, Text, TouchableOpacity } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Message from "../components/SomeMessage";
import { COLORS } from "../constants/theme";

const welcome = () => {
  const router = useRouter()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
        <Stack.Screen
            options={{
            headerStyle: {
                backgroundColor: COLORS.primary,
            },
            headerTintColor: COLORS.white,
            headerTitleStyle: {
                fontWeight: 'bold',
            },
            headerTitle: "ShareBuy",
            headerRight: () => (
                <TouchableOpacity onPress={() => alert('Button Pressed')}>
                    <Image
                        source={require('../assets/icons/profile.png')}
                        style={{ width: 30, height: 30, marginRight: 10 }}
                    />
                </TouchableOpacity>
            ),
            }}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
            <Message message="Welcome to ShareBuy" />
        </ScrollView>
        
    </SafeAreaView>
  );
};

export default welcome;