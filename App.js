import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';
import Icon from 'react-native-vector-icons/Ionicons';

// Import screens
import MessageBoard from './src/screens/MessageBoard';
import WishList from './src/screens/WishList';
import AngryMode from './src/screens/AngryMode';
import WishBottle from './src/screens/WishBottle';
import AIChat from './src/screens/AIChat';

const Tab = createBottomTabNavigator();

const App = () => {
  const [currentTab, setCurrentTab] = useState('messages');
  const [punchCount, setPunchCount] = useState(0);
  const [maxPower, setMaxPower] = useState(0);

  // Initialize sound effects
  useEffect(() => {
    Sound.setCategory('Playback');
    const punchSound = new Sound('punch.mp3');
    const celebrationSound = new Sound('celebration.mp3');
    
    return () => {
      punchSound.release();
      celebrationSound.release();
    };
  }, []);

  // Load data from storage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem('appData');
      if (data) {
        const parsedData = JSON.parse(data);
        setPunchCount(parsedData.punchCount || 0);
        setMaxPower(parsedData.maxPower || 0);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'messages') {
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
            } else if (route.name === 'wishes') {
              iconName = focused ? 'list' : 'list-outline';
            } else if (route.name === 'angry') {
              iconName = focused ? 'flame' : 'flame-outline';
            } else if (route.name === 'bottle') {
              iconName = focused ? 'water' : 'water-outline';
            } else if (route.name === 'aichat') {
              iconName = focused ? 'brain' : 'brain-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4A90E2',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          name="messages" 
          component={MessageBoard}
          options={{ title: 'Messages' }}
        />
        <Tab.Screen 
          name="wishes" 
          component={WishList}
          options={{ title: 'Wishes' }}
        />
        <Tab.Screen 
          name="angry" 
          component={AngryMode}
          options={{ title: 'Angry Mode' }}
        />
        <Tab.Screen 
          name="bottle" 
          component={WishBottle}
          options={{ title: 'Wish Bottle' }}
        />
        <Tab.Screen 
          name="aichat" 
          component={AIChat}
          options={{ title: 'AI Chat' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App; 