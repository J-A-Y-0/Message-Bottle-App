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

const WishList = () => {
  const [wishes, setWishes] = useState([]);
  const [newWish, setNewWish] = useState('');
  const [showAddWish, setShowAddWish] = useState(false);

  // Load wishes from storage
  useEffect(() => {
    loadWishes();
  }, []);

  const loadWishes = async () => {
    try {
      const storedWishes = await AsyncStorage.getItem('wishes');
      if (storedWishes) {
        setWishes(JSON.parse(storedWishes));
      }
    } catch (error) {
      console.error('Error loading wishes:', error);
    }
  };

  // Save wish
  const saveWish = async () => {
    if (!newWish.trim()) {
      Alert.alert('Error', 'Please enter a wish');
      return;
    }

    try {
      const newWishItem = {
        id: Date.now().toString(),
        content: newWish.trim(),
        createTime: new Date().toISOString(),
        isCompleted: false,
      };

      const updatedWishes = [newWishItem, ...wishes];
      setWishes(updatedWishes);
      await AsyncStorage.setItem('wishes', JSON.stringify(updatedWishes));
      setNewWish('');
      setShowAddWish(false);
    } catch (error) {
      console.error('Error saving wish:', error);
      Alert.alert('Error', 'Failed to save wish');
    }
  };

  // Toggle wish completion
  const toggleWish = async (id) => {
    try {
      const updatedWishes = wishes.map(wish => {
        if (wish.id === id) {
          return { ...wish, isCompleted: !wish.isCompleted };
        }
        return wish;
      });
      setWishes(updatedWishes);
      await AsyncStorage.setItem('wishes', JSON.stringify(updatedWishes));
    } catch (error) {
      console.error('Error updating wish:', error);
      Alert.alert('Error', 'Failed to update wish');
    }
  };

  // Delete wish
  const deleteWish = async (id) => {
    try {
      const updatedWishes = wishes.filter(wish => wish.id !== id);
      setWishes(updatedWishes);
      await AsyncStorage.setItem('wishes', JSON.stringify(updatedWishes));
    } catch (error) {
      console.error('Error deleting wish:', error);
      Alert.alert('Error', 'Failed to delete wish');
    }
  };

  // Clear all wishes
  const clearAllWishes = async () => {
    Alert.alert(
      'Clear Wishes',
      'Are you sure you want to clear all wishes?',
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
              await AsyncStorage.setItem('wishes', JSON.stringify([]));
              setWishes([]);
            } catch (error) {
              console.error('Error clearing wishes:', error);
              Alert.alert('Error', 'Failed to clear wishes');
            }
          },
        },
      ]
    );
  };

  const renderWish = ({ item }) => (
    <View style={styles.wishItem}>
      <TouchableOpacity
        style={styles.wishContent}
        onPress={() => toggleWish(item.id)}
      >
        <Icon
          name={item.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
          size={24}
          color={item.isCompleted ? '#4CAF50' : '#666'}
        />
        <Text style={[
          styles.wishText,
          item.isCompleted && styles.completedWish
        ]}>
          {item.content}
        </Text>
      </TouchableOpacity>
      <View style={styles.wishActions}>
        <Text style={styles.wishTime}>
          {new Date(item.createTime).toLocaleString()}
        </Text>
        <TouchableOpacity
          onPress={() => deleteWish(item.id)}
          style={styles.deleteButton}
        >
          <Icon name="trash-outline" size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Wish List</Text>
        <TouchableOpacity
          onPress={clearAllWishes}
          style={styles.clearButton}
        >
          <Icon name="trash-outline" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={wishes}
        renderItem={renderWish}
        keyExtractor={item => item.id}
        style={styles.wishList}
      />

      {showAddWish ? (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={newWish}
            onChangeText={setNewWish}
            placeholder="Write your wish..."
            multiline
          />
          <View style={styles.inputActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => {
                setShowAddWish(false);
                setNewWish('');
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.saveButton]}
              onPress={saveWish}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddWish(true)}
        >
          <Icon name="add-circle" size={24} color="#fff" />
          <Text style={styles.addButtonText}>Add New Wish</Text>
        </TouchableOpacity>
      )}
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
  wishList: {
    flex: 1,
  },
  wishItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  wishContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  wishText: {
    fontSize: 16,
    marginLeft: 10,
    flex: 1,
  },
  completedWish: {
    textDecorationLine: 'line-through',
    color: '#666',
  },
  wishActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wishTime: {
    fontSize: 12,
    color: '#666',
  },
  deleteButton: {
    padding: 5,
  },
  inputContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 10,
    maxHeight: 100,
  },
  inputActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  saveButton: {
    backgroundColor: '#ff4444',
  },
  cancelButtonText: {
    color: '#666',
  },
  saveButtonText: {
    color: '#fff',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4444',
    padding: 15,
    margin: 15,
    borderRadius: 25,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default WishList; 