import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function InitialPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const role = await AsyncStorage.getItem('role'); 
        console.log("role: "+role);
        if (role === 'STUDENT') {
          console.log("came hereeeeeeeeeee")
          router.replace('/(student)'); 
        } else if (role === 'TEACHER') {
          router.replace('/(teacher)'); 
        } else {
          router.replace('/auth/login'); 
        }
      } catch (error) {
        console.error('Error checking role:', error);
        router.replace('/auth/login'); 
      }
    };

    checkUserRole();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Checking authentication...</Text>
      <ActivityIndicator size="large" color="#7AADFE" />
    </View>
  );
}
