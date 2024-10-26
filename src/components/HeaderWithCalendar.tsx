import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CalendarComponent from './CalendarComponent'; // Assuming you already have this

const HeaderWithCalendar = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.greetingText}>Good morning</Text>
      <Text style={styles.studentText}>Gnanesh G CSE Student</Text>
      {/* <CalendarComponent /> Your existing Calendar Component */}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  greetingText: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 5,
  },
  studentText: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 20,
  },
});

export default HeaderWithCalendar;
