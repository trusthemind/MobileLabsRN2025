import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, TextInput, Modal, Alert, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import OneSignal from 'react-native-onesignal';

// OneSignal App ID - замініть на власний ID з консолі OneSignal
const ONESIGNAL_APP_ID = 'YOUR_ONESIGNAL_APP_ID';

// Налаштування поведінки сповіщень
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [expoToken, setExpoToken] = useState('');
  const [playerId, setPlayerId] = useState('');

  // Ініціалізація при запуску додатку
  useEffect(() => {
    // Ініціалізація OneSignal
    initOneSignal();
    
    // Отримання push token
    registerForPushNotificationsAsync();
    
    // Завантаження збережених задач
    loadTasks();
    
    // Встановлення слухача для сповіщень, що відкриваються
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('Сповіщення отримано:', notification);
    });
    
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Сповіщення відкрито:', response);
    });
    
    return () => {
      // Видалення слухачів при розмонтуванні компонента
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  
  // Ініціалізація OneSignal
  const initOneSignal = async () => {
    // Встановлення налаштувань OneSignal
    OneSignal.setAppId(ONESIGNAL_APP_ID);
    
    // Запит на дозвіл отримувати сповіщення
    OneSignal.promptForPushNotificationsWithUserResponse();
    
    // Налаштування обробників подій
    OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {
      const notification = notificationReceivedEvent.getNotification();
      console.log("Сповіщення отримано в активному режимі:", notification);
      // Показуємо сповіщення навіть якщо додаток відкрито
      notificationReceivedEvent.complete(notification);
    });
    
    // Обробник відкриття сповіщення
    OneSignal.setNotificationOpenedHandler(openedEvent => {
      const { notification } = openedEvent;
      console.log('Сповіщення відкрито:', notification);
    });
    
    // Отримання ID пристрою
    const deviceState = await OneSignal.getDeviceState();
    if (deviceState && deviceState.userId) {
      console.log('OneSignal PlayerId:', deviceState.userId);
      setPlayerId(deviceState.userId);
    }
  };
  
  // Отримання токену для push-сповіщень
  const registerForPushNotificationsAsync = async () => {
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert('Помилка', 'Не вдалося отримати дозвіл на сповіщення!');
        return;
      }
      
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo push token:', token);
      setExpoToken(token);
    } else {
      Alert.alert('Увага', 'Для роботи push-сповіщень потрібен фізичний пристрій');
    }
    
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };
  
  // Завантаження задач з локального сховища
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.log('Помилка при завантаженні задач:', error);
    }
  };
  
  // Збереження задач у локальне сховище
  const saveTasks = async (updatedTasks) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    } catch (error) {
      console.log('Помилка при збереженні задач:', error);
    }
  };
  
  // Планування локального сповіщення через Expo
  const scheduleLocalNotification = async (taskId, title, description, date) => {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: description || 'Час виконати задачу!',
          data: { taskId },
        },
        trigger: {
          date: date,
        },
      });
      console.log('Локальне сповіщення заплановано:', notificationId);
      return notificationId;
    } catch (error) {
      console.log('Помилка планування локального сповіщення:', error);
      return null;
    }
  };
  
  // Планування віддаленого сповіщення через OneSignal
  const scheduleOneSignalNotification = async (taskId, title, description, date) => {
    if (!playerId) {
      console.log('OneSignal PlayerId не доступний');
      return null;
    }
    
    try {
      const response = await fetch('https://onesignal.com/api/v1/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Basic YOUR_ONESIGNAL_REST_API_KEY'
        },
        body: JSON.stringify({
          app_id: ONESIGNAL_APP_ID,
          include_player_ids: [playerId],
          send_after: new Date(date).toISOString(),
          headings: { en: title },
          contents: { en: description || 'Час виконати задачу!' },
          data: { taskId },
          android_channel_id: "default"
        })
      });
      
      const data = await response.json();
      
      if (data.id) {
        console.log('OneSignal сповіщення заплановано:', data.id);
        return data.id;
      } else {
        console.log('Помилка планування OneSignal сповіщення:', data);
        return null;
      }
    } catch (error) {
      console.log('Помилка відправки OneSignal сповіщення:', error);
      return null;
    }
  };
  
  // Скасування локального сповіщення
  const cancelLocalNotification = async (notificationId) => {
    if (!notificationId) return;
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('Локальне сповіщення скасовано:', notificationId);
    } catch (error) {
      console.log('Помилка скасування локального сповіщення:', error);
    }
  };
  
  // Скасування віддаленого сповіщення OneSignal
  const cancelOneSignalNotification = async (notificationId) => {
    if (!notificationId) return;
    
    try {
      const response = await fetch(`https://onesignal.com/api/v1/notifications/${notificationId}?app_id=${ONESIGNAL_APP_ID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Basic YOUR_ONESIGNAL_REST_API_KEY'
        }
      });
      
      console.log('OneSignal сповіщення скасовано:', notificationId);
    } catch (error) {
      console.log('Помилка скасування OneSignal сповіщення:', error);
    }
  };
  
  // Додавання нової задачі
  const addTask = async () => {
    if (!title.trim()) {
      Alert.alert('Помилка', 'Назва задачі не може бути порожньою');
      return;
    }
    
    const taskId = Date.now().toString();
    
    // Плануємо сповіщення через OneSignal
    const oneSignalNotificationId = await scheduleOneSignalNotification(taskId, title, description, date);
    
    // Плануємо локальне сповіщення як резервний варіант
    const localNotificationId = await scheduleLocalNotification(taskId, title, description, date);
    
    const newTask = {
      id: taskId,
      title,
      description,
      date: date.toISOString(),
      oneSignalNotificationId,
      localNotificationId
    };
    
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    
    setTitle('');
    setDescription('');
    setDate(new Date());
    setModalVisible(false);
  };
  
  // Видалення задачі
  const deleteTask = async (id) => {
    const taskToDelete = tasks.find(task => task.id === id);
    
    if (taskToDelete) {
      // Скасовуємо всі сповіщення
      if (taskToDelete.oneSignalNotificationId) {
        await cancelOneSignalNotification(taskToDelete.oneSignalNotificationId);
      }
      
      if (taskToDelete.localNotificationId) {
        await cancelLocalNotification(taskToDelete.localNotificationId);
      }
    }
    
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };
  
  // Показати вибір дати і часу
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  
  // Сховати вибір дати і часу
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  
  // Обробка вибору дати і часу
  const handleConfirm = (selectedDate) => {
    hideDatePicker();
    setDate(selectedDate);
  };
  
  // Форматування дати для відображення
  const formatDate = (dateString) => {
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('uk-UA', options);
  };
  
  // Рендеринг елементу задачі
  const renderItem = ({ item }) => (
    <View style={styles.taskItem}>
      <View style={styles.taskInfo}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        {item.description ? <Text style={styles.taskDescription}>{item.description}</Text> : null}
        <Text style={styles.taskDate}>{formatDate(item.date)}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteTask(item.id)}
      >
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>To-Do Reminder</Text>
      </View>
      
      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={styles.taskList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Немає задач</Text>
        </View>
      )}
      
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      
      {/* Модальне вікно для додавання задачі */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Нова задача</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Назва задачі"
              value={title}
              onChangeText={setTitle}
            />
            
            <TextInput
              style={[styles.input, styles.descriptionInput]}
              placeholder="Опис (необов'язково)"
              value={description}
              onChangeText={setDescription}
              multiline
            />
            
            <TouchableOpacity
              style={styles.dateButton}
              onPress={showDatePicker}
            >
              <Text style={styles.dateButtonText}>
                Виберіть дату і час: {formatDate(date.toISOString())}
              </Text>
            </TouchableOpacity>
            
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="datetime"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              minimumDate={new Date()}
              date={date}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Скасувати</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={addTask}
              >
                <Text style={styles.buttonText}>Зберегти</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: Constants.statusBarHeight,
  },
  header: {
    backgroundColor: '#4a90e2',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  taskList: {
    flex: 1,
    padding: 10,
  },
  taskItem: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  taskDate: {
    fontSize: 12,
    color: '#4a90e2',
  },
  deleteButton: {
    backgroundColor: '#ff6b6b',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4a90e2',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButtonText: {
    fontSize: 30,
    color: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#888',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  descriptionInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 12,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#ddd',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#4a90e2',
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});