import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity, Alert, StyleSheet, Image } from 'react-native';
import { useAuth } from '@/src/providers/AuthProvider';
import { Redirect, router } from 'expo-router';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading } = useAuth(); // Access the login function

  const handleLogin = async () => {
    try {
        console.log("came here")
      await login(username, password); // Call login from the AuthProvider
      // Redirect or handle post-login actions here
      console.log("came here3");
    
    } catch (error) {
      Alert.alert('Login failed', 'Invalid username or password');
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo or Image */}
      <Image source={{ uri: 'https://cdn.vectorstock.com/i/500p/43/98/student-education-logo-vector-14724398.jpg' }} style={styles.logo} />

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Please login to your account</Text>

      {/* Username Input */}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#A9A9A9"
        autoCapitalize='none'
        value={username}
        onChangeText={setUsername}
        spellCheck={false}
      />

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#A9A9A9"
        value={password}
        secureTextEntry
        autoCapitalize='none'
        spellCheck={false}
        onChangeText={setPassword}
      />

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      {/* Additional options (e.g., forgot password)
      <Text style={styles.forgotPasswordText}>Forgot your password?</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    borderColor: '#DDD',
    borderWidth: 1,
    marginBottom: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#7AADFE',
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    textAlign: 'center',
    color: '#7AADFE',
    fontSize: 14,
  },
});
