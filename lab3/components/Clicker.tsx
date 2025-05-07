import { useNavigation, NavigationProp } from '@react-navigation/native';
import { randomInt } from 'helpers/randomInt';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { GestureDetector, GestureHandlerRootView, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { useTaskContext } from './TasksContext';

type RootStackParamList = {
  Tasks: undefined;
};

export default function Clicker() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {
    score,
    setScore,
    clicks,
    setClicks,
    doubleClicks,
    setDoubleClicks,
    setLongPress,
    setPan,
    setFlingRight,
    setFlingLeft,
    setPinch,
  } = useTaskContext();

  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: offsetX.value },
      { translateY: offsetY.value },
      { scale: scale.value },
    ],
  }));

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => {
      setClicks((prev) => prev + 1);
      setScore((prev) => prev + 1);
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      setDoubleClicks((prev) => prev + 1);
      setScore((prev) => prev + 2);
    });

  const longPress = Gesture.LongPress()
    .minDuration(3000)
    .onStart(() => {
      setLongPress(true);
      setScore((prev) => prev + 5);
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      offsetX.value = e.translationX;
      offsetY.value = e.translationY;
    })
    .onEnd(() => {
      setPan(true);
      offsetX.value = withSpring(0);
      offsetY.value = withSpring(0);
    });

  const flingRight = Gesture.Fling()
    .direction(1)
    .onEnd(() => {
      setFlingRight(true);
      const points = randomInt(1, 5);
      setScore((prev) => prev + points);
    });

  const flingLeft = Gesture.Fling()
    .direction(2)
    .onEnd(() => {
      setFlingLeft(true);
      const points = randomInt(1, 5);
      setScore((prev) => prev + points);
    });

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = e.scale;
    })
    .onEnd(() => {
      setPinch(true);
      scale.value = withTiming(1);
      setScore((prev) => prev + 10);
    });

  const composedGesture = Gesture.Race(
    pinch,
    Gesture.Simultaneous(
      Gesture.Simultaneous(singleTap, doubleTap),
      Gesture.Simultaneous(longPress, pan, flingRight, flingLeft)
    )
  );

  return (
    <GestureHandlerRootView className="flex-1 items-center justify-center bg-white">
      <View className="flex flex-col items-center gap-4">
        <Text className="text-3xl font-bold">Очки: {score}</Text>

        <GestureDetector gesture={composedGesture}>
          <Animated.View
            className="h-32 w-32 items-center justify-center rounded-full bg-blue-400"
            style={animatedStyle}>
            <Text className="font-bold text-white">Натисни мене</Text>
          </Animated.View>
        </GestureDetector>

        <TouchableOpacity
          className="rounded-lg bg-green-500 px-6 py-4"
          onPress={() => navigation.navigate('Tasks')}>
          <Text className="font-bold text-white">📋 Переглянути завдання</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}
