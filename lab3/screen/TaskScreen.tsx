import { StackNavigationProp } from '@react-navigation/stack';
import { useTaskContext } from 'components/TasksContext';
import React from 'react';
import { FlatList, Text, View, TouchableOpacity } from 'react-native';

type RootStackParamList = {
  TasksScreen: undefined;
  Clicker: undefined;
};

type TasksScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TasksScreen'>;

export default function TasksScreen({ navigation }: { navigation: TasksScreenNavigationProp }) {
  const { tasks } = useTaskContext();

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="mb-4 text-2xl font-bold">Список завдань</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="mb-2 flex-row items-center justify-between rounded-lg bg-gray-100 p-4">
            <Text>{item.title}</Text>
            <Text className={item.completed ? 'text-green-600' : 'text-red-600'}>
              {item.completed ? '✅ Виконано' : '❌ Ні'}
            </Text>
          </View>
        )}
      />

      <TouchableOpacity
        className="mt-6 items-center rounded-lg bg-blue-500 p-4"
        onPress={() => navigation.navigate('Clicker')}>
        <Text className="text-black">⬅️ Назад до гри</Text>
      </TouchableOpacity>
    </View>
  );
}
