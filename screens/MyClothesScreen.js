// MyClothesScreen.js

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Button, 
  Modal, 
  TouchableOpacity, 
  Image, 
  Platform, 
  Alert,
  ScrollView,
  FlatList,
  TextInput,
  SectionList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import RNPickerSelect from 'react-native-picker-select'; // Import the picker

export default function MyClothesScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [image, setImage] = useState(null);
  const [clothes, setClothes] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');

  // Define available categories
  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];

  // Request permissions on component mount
  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        // Request media library permissions
        const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (mediaStatus !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Sorry, we need media library permissions to make this work!',
            [{ text: 'OK' }]
          );
        }

        // Request camera permissions
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (cameraStatus !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Sorry, we need camera permissions to make this work!',
            [{ text: 'OK' }]
          );
        }
      }
    })();
  }, []);

  const renderStars = () => {
    const stars = [];
    for(let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? 'star' : 'star-outline'}
            size={40}
            color="#FFD700" // Gold color for filled stars
          />
        </TouchableOpacity>
      );
    }
    return (
      <View style={styles.starContainer}>
        {stars}
      </View>
    );
  };

  const openImagePickerAsync = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Image Picker Result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking an image:', error);
      Alert.alert('Error', 'An error occurred while picking the image.');
    }
  };

  const openCameraAsync = async () => {
    try {
      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      console.log('Camera Result:', result);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking a photo:', error);
      Alert.alert('Error', 'An error occurred while taking the photo.');
    }
  };

  const handleAddImage = () => {
    Alert.alert(
      'Add Image',
      'Choose an option',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Pick from Gallery', onPress: openImagePickerAsync },
        { text: 'Take a Photo', onPress: openCameraAsync },
      ],
      { cancelable: true }
    );
  };

  const handleSaveItem = () => {
    if (!image) {
      Alert.alert('Missing Image', 'Please add an image of the clothing item.');
      return;
    }
    if (!name.trim()) {
      Alert.alert('Missing Name', 'Please enter the name of the clothing item.');
      return;
    }
    if (!category) {
      Alert.alert('Missing Category', 'Please select a category.');
      return;
    }
    const newItem = { id: Date.now().toString(), image, rating, name, category };
    setClothes([...clothes, newItem]);
    setImage(null);
    setRating(0);
    setName('');
    setCategory('');
    setModalVisible(false);
    Alert.alert('Success', 'Clothing item added successfully!');
  };

  const renderClothesItem = ({ item }) => (
    <View style={styles.clothesItem}>
      <Image source={{ uri: item.image }} style={styles.clothesImage} />
      <View style={styles.clothesInfo}>
        <Text style={styles.clothesName}>{item.name}</Text>
        <Text style={styles.clothesRating}>Rating: {item.rating} / 5</Text>
      </View>
    </View>
  );

   // Group clothes by category
  const clothesByCategory = categories.map(cat => ({
    title: cat,
    data: clothes.filter(item => item.category === cat),
  })).filter(section => section.data.length > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Clothes</Text>
      <Button title="Add Item" onPress={() => setModalVisible(true)} />

      {/* List of clothes grouped by category */}
      {clothesByCategory.length > 0 ? (
        <SectionList
          sections={clothesByCategory}
          keyExtractor={(item) => item.id}
          renderItem={renderClothesItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          contentContainerStyle={styles.clothesList}
        />
      ) : (
        <Text style={styles.noClothesText}>No items added yet.</Text>
      )}

      {/* Modal for adding a new item */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setImage(null);
          setRating(0);
          setName('');
          setCategory('');
          setModalVisible(false);
        }}
      >
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add a New Item</Text>
          
          {/* Image picker */}
          <TouchableOpacity onPress={handleAddImage} style={styles.imagePlaceholder}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <>
                <Ionicons name="image-outline" size={100} color="gray" />
                <Text style={styles.imageText}>Add Image</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Name Input */}
          <TextInput
            style={styles.input}
            placeholder="Enter item name"
            value={name}
            onChangeText={setName}
          />

          {/* Category Picker */}
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={(value) => setCategory(value)}
              items={categories.map(cat => ({ label: cat, value: cat }))}
              placeholder={{ label: 'Select Category', value: null }}
              style={{
                inputIOS: styles.picker,
                inputAndroid: styles.picker,
              }}
              value={category}
            />
          </View>

          {/* Star Rating */}
          <Text style={styles.ratingText}>Rate this item:</Text>
          {renderStars()}

          {/* Save and Cancel Buttons */}
          <View style={styles.buttonContainer}>
            <Button title="Save Item" onPress={handleSaveItem} />
            <Button 
              title="Cancel" 
              color="red" 
              onPress={() => {
                setImage(null);
                setRating(0);
                setName('');
                setCategory('');
                setModalVisible(false);
              }} 
            />
          </View>
        </ScrollView>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
  },
  clothesList: {
    marginTop: 20,
    paddingBottom: 20,
  },
  noClothesText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 20,
    fontSize: 16,
  },
  clothesItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fafafa',
  },
  clothesImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  clothesInfo: {
    flex: 1,
  },
  clothesName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  clothesRating: {
    fontSize: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    backgroundColor: '#f5f5f5',
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  modalContainer: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 20,
  },
  starContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderStyle: 'dashed',
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  imageText: {
    marginTop: 10,
    color: 'gray',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  ratingText: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  pickerContainer: {
    width: '80%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 40,
  },
});
