import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function OutfitCard({ title }) {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        {/* Placeholder Image */}
        <Image style={styles.image} source={require('../assets/icon.png')} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 300,
    height: 400,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
});
