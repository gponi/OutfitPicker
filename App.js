import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import MyClothesScreen from './screens/MyClothesScreen';
import ExploreScreen from './screens/ExploreScreen';
import SavedScreen from './screens/SavedScreen';
import AccountScreen from './screens/AccountScreen';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'My Clothes') {
              iconName = 'shirt-outline';
            } else if (route.name === 'Saved') {
              iconName = 'heart-outline';
            } else if (route.name === 'Generate') {
              iconName = 'flash-outline';  // or 'magic-wand-outline'
            } else if (route.name === 'Explore') {
              iconName = 'search-outline';  // or 'compass-outline'
            } else if (route.name === 'Account') {
              iconName = 'person-outline';
            }            
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: [{ display: 'flex' }, null],
        })}
      >
        <Tab.Screen name="My Clothes" component={MyClothesScreen} />
        <Tab.Screen name="Saved" component={SavedScreen} />
        <Tab.Screen name="Generate" component={HomeScreen} />
        <Tab.Screen name="Explore" component={ExploreScreen} />
        <Tab.Screen name="Account" component={AccountScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
