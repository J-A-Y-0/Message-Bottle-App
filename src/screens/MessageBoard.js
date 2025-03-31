import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const MessageBoard = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMood, setSelectedMood] = useState('happy');

  // Load messages from storage
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const storedMessages = await AsyncStorage.getItem('messages');
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Save message
  const saveMessage = async () => {
    if (!newMessage.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    try {
      const newMsg = {
        id: Date.now().toString(),
        content: newMessage.trim(),
        mood: selectedMood,
        createTime: new Date().toISOString(),
        isRead: false,
      };

      const updatedMessages = [newMsg, ...messages];
      setMessages(updatedMessages);
      await AsyncStorage.setItem('messages', JSON.stringify(updatedMessages));
      setNewMessage('');
    } catch (error) {
      console.error('Error saving message:', error);
      Alert.alert('Error', 'Failed to save message');
    }
  };

  // Delete message
  const deleteMessage = async (id) => {
    try {
      const updatedMessages = messages.filter(msg => msg.id !== id);
      setMessages(updatedMessages);
      await AsyncStorage.setItem('messages', JSON.stringify(updatedMessages));
    } catch (error) {
      console.error('Error deleting message:', error);
      Alert.alert('Error', 'Failed to delete message');
    }
  };

  // Clear all messages
  const clearAllMessages = async () => {
    Alert.alert(
      'Clear Messages',
      'Are you sure you want to clear all messages?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.setItem('messages', JSON.stringify([]));
              setMessages([]);
            } catch (error) {
              console.error('Error clearing messages:', error);
              Alert.alert('Error', 'Failed to clear messages');
            }
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }) => (
    <View style={styles.messageItem}>
      <View style={styles.messageHeader}>
        <Text style={styles.messageTime}>
          {new Date(item.createTime).toLocaleString()}
        </Text>
        <TouchableOpacity
          onPress={() => deleteMessage(item.id)}
          style={styles.deleteButton}
        >
          <Icon name="trash-outline" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>
      <Text style={styles.messageContent}>{item.content}</Text>
      <Text style={styles.messageMood}>{getMoodEmoji(item.mood)}</Text>
    </View>
  );

  const getMoodEmoji = (mood) => {
    const moodEmojis = {
      happy: '😊',
      sad: '😢',
      angry: '😠',
      love: '❤️',
      laugh: '😂',
    };
    return moodEmojis[mood] || '😊';
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Message Board</Text>
        <TouchableOpacity
          onPress={clearAllMessages}
          style={styles.clearButton}
        >
          <Icon name="trash-outline" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        style={styles.messageList}
      />

      <View style={styles.inputContainer}>
        <View style={styles.moodSelector}>
          {['happy', 'sad', 'angry', 'love', 'laugh'].map(mood => (
            <TouchableOpacity
              key={mood}
              style={[
                styles.moodButton,
                selectedMood === mood && styles.selectedMood,
              ]}
              onPress={() => setSelectedMood(mood)}
            >
              <Text style={styles.moodEmoji}>{getMoodEmoji(mood)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Write your message..."
            multiline
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={saveMessage}
          >
            <Icon name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 5,
  },
  messageList: {
    flex: 1,
  },
  messageItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 5,
  },
  messageContent: {
    fontSize: 16,
    marginBottom: 5,
  },
  messageMood: {
    fontSize: 20,
  },
  inputContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  moodButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedMood: {
    backgroundColor: '#ff4444',
  },
  moodEmoji: {
    fontSize: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#ff4444',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MessageBoard; 