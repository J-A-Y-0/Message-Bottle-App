import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { api } from '../services/api';

const WishBottle = () => {
  const [wish, setWish] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalWishes: 0, activeUsers: 0 });
  const [bottleAnimation] = useState(new Animated.Value(0));

  // Load initial stats
  useEffect(() => {
    loadStats();
  }, []);

  // Load statistics from server
  const loadStats = async () => {
    try {
      const response = await api.getWishesCount();
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  // Send wish to server
  const sendWish = async () => {
    if (!wish.trim()) {
      Alert.alert('Error', 'Please write your wish first');
      return;
    }

    setLoading(true);
    try {
      const response = await api.sendWish({
        content: wish.trim(),
        location: 'Unknown', // In real app, get user's location
      });

      if (response.success) {
        Alert.alert('Success', 'Your wish has been sent into the ocean!');
        setWish('');
        loadStats();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send wish. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get random wish from server
  const getRandomWish = async () => {
    setLoading(true);
    try {
      const response = await api.getRandomWish();
      if (response.success) {
        // Animate bottle
        Animated.sequence([
          Animated.timing(bottleAnimation, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(bottleAnimation, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]).start();

        Alert.alert(
          'Wish Found!',
          `"${response.data.content}"\n\nFrom: ${response.data.location}\nTime: ${new Date(response.data.createTime).toLocaleString()}`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to get random wish. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Wish Bottle</Text>
        <View style={styles.stats}>
          <Text style={styles.statText}>
            {stats.totalWishes.toLocaleString()} wishes in the ocean
          </Text>
          <Text style={styles.statText}>
            {stats.activeUsers.toLocaleString()} active users
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.bottle,
            {
              transform: [
                {
                  translateY: bottleAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
        >
          <Icon name="water" size={60} color="#4A90E2" />
        </Animated.View>

        <TextInput
          style={styles.input}
          value={wish}
          onChangeText={setWish}
          placeholder="Write your wish..."
          multiline
          numberOfLines={4}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.sendButton]}
            onPress={sendWish}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="send" size={20} color="#fff" />
                <Text style={styles.buttonText}>Send Wish</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.receiveButton]}
            onPress={getRandomWish}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Icon name="water" size={20} color="#fff" />
                <Text style={styles.buttonText}>Get Random Wish</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#4A90E2',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  stats: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 10,
    borderRadius: 10,
  },
  statText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 5,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  bottle: {
    marginVertical: 30,
  },
  input: {
    width: '100%',
    height: 120,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  sendButton: {
    backgroundColor: '#4A90E2',
  },
  receiveButton: {
    backgroundColor: '#50E3C2',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default WishBottle; 