import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Sound from 'react-native-sound';

const AngryMode = () => {
  const [punchCount, setPunchCount] = useState(0);
  const [maxPower, setMaxPower] = useState(0);
  const [showPunchEffect, setShowPunchEffect] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [punchPosition, setPunchPosition] = useState({ x: 0, y: 0 });
  
  const punchAnimation = useRef(new Animated.Value(0)).current;
  const celebrationAnimation = useRef(new Animated.Value(0)).current;

  // Handle punch action
  const handlePunch = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    setPunchPosition({ x: locationX, y: locationY });
    setShowPunchEffect(true);

    // Play punch sound
    const punchSound = new Sound('punch.mp3');
    punchSound.play();

    // Calculate power
    const power = Math.floor(Math.random() * 100) + 1;
    const newPunchCount = punchCount + 1;
    const newMaxPower = Math.max(maxPower, power);

    // Update state
    setPunchCount(newPunchCount);
    setMaxPower(newMaxPower);

    // Save to storage
    AsyncStorage.setItem('punchCount', newPunchCount.toString());
    AsyncStorage.setItem('maxPower', newMaxPower.toString());

    // Animate punch effect
    Animated.sequence([
      Animated.timing(punchAnimation, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(punchAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Check for celebration
    if (newPunchCount % 100 === 0) {
      showCelebrationEffect();
    }
  };

  // Show celebration effect
  const showCelebrationEffect = () => {
    setShowCelebration(true);
    const celebrationSound = new Sound('celebration.mp3');
    celebrationSound.play();

    Animated.sequence([
      Animated.timing(celebrationAnimation, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(5000),
      Animated.timing(celebrationAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowCelebration(false);
    });
  };

  // Finish punching
  const finishPunching = async () => {
    try {
      // Create new message
      const newMessage = {
        id: Date.now().toString(),
        content: `Just finished punching ${punchCount} times!`,
        mood: 'angry',
        createTime: new Date().toISOString(),
        isRead: false,
      };

      // Get existing messages
      const messages = await AsyncStorage.getItem('messages');
      const messagesArray = messages ? JSON.parse(messages) : [];
      
      // Add new message
      messagesArray.unshift(newMessage);
      
      // Save updated messages
      await AsyncStorage.setItem('messages', JSON.stringify(messagesArray));

      // Reset punch count
      setPunchCount(0);
      await AsyncStorage.setItem('punchCount', '0');
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Angry Mode</Text>
        <Text style={styles.subtitle}>Tap to punch!</Text>
      </View>

      <TouchableOpacity 
        style={styles.content} 
        onPress={handlePunch}
        activeOpacity={0.9}
      >
        <Image
          source={require('../../assets/images/target.png')}
          style={[
            styles.targetImage,
            showPunchEffect && styles.punchedImage
          ]}
          resizeMode="contain"
        />
        
        {showPunchEffect && (
          <Animated.View
            style={[
              styles.punchEffect,
              {
                left: punchPosition.x,
                top: punchPosition.y,
                transform: [
                  { translateX: -25 },
                  { translateY: -25 },
                  { scale: punchAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.8, 1.2]
                  })}
                ]
              }
            ]}
          >
            <Text style={styles.punchEmoji}>👊</Text>
          </Animated.View>
        )}
      </TouchableOpacity>

      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Punches</Text>
          <Text style={styles.statValue}>{punchCount}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Max Power</Text>
          <Text style={styles.statValue}>{maxPower}</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.finishButton}
        onPress={finishPunching}
      >
        <Text style={styles.finishButtonText}>Finish</Text>
      </TouchableOpacity>

      {showCelebration && (
        <Animated.View
          style={[
            styles.celebrationOverlay,
            {
              opacity: celebrationAnimation,
              transform: [{
                scale: celebrationAnimation.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1]
                })
              }]
            }
          ]}
        >
          <View style={styles.celebrationContent}>
            <Text style={styles.celebrationEmoji}>😭</Text>
            <Text style={styles.celebrationText}>Target Surrendered!</Text>
            <Text style={styles.celebrationEmoji}>🎉</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff4444',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  targetImage: {
    width: 200,
    height: 200,
  },
  punchedImage: {
    transform: [{ scale: 0.95 }],
  },
  punchEffect: {
    position: 'absolute',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  punchEmoji: {
    fontSize: 40,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#fff',
    fontSize: 14,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  finishButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 25,
    margin: 20,
    alignItems: 'center',
  },
  finishButtonText: {
    color: '#ff4444',
    fontSize: 18,
    fontWeight: 'bold',
  },
  celebrationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  celebrationContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  celebrationEmoji: {
    fontSize: 40,
    marginVertical: 10,
  },
  celebrationText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff4444',
  },
});

export default AngryMode; 