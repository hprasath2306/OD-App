import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ODCard = ({ title, progress, status }:{
    title: string,
    progress: number,
    status: string
}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.header}>
        <Text style={styles.status}>{status}</Text>
        <TouchableOpacity>
          <MaterialIcons name="info-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Progress</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{progress}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#E0F1FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  status: {
    backgroundColor: '#FFA500',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 5,
    color: '#fff',
    fontSize: 12,
  },
  title: {
    fontSize: 16,
    color: '#333',
    marginVertical: 10,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 12,
    marginRight: 10,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#d0d0d0',
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  progressBarFill: {
    height: 8,
    backgroundColor: '#6495ED',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 12,
    color: '#555',
  },
});

export default ODCard;
