import './global.css';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TaskProvider } from 'components/TasksContext';
import React from 'react';
import TasksScreen from 'screen/TaskScreen';

import Clicker from './components/Clicker';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TaskProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Clicker">
          <Stack.Screen name="Clicker" component={Clicker} />
          <Stack.Screen name="Tasks" component={TasksScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TaskProvider>
  );
}
