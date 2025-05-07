import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TaskContextType {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;

  clicks: number;
  setClicks: React.Dispatch<React.SetStateAction<number>>;

  doubleClicks: number;
  setDoubleClicks: React.Dispatch<React.SetStateAction<number>>;

  longPress: boolean;
  setLongPress: React.Dispatch<React.SetStateAction<boolean>>;

  pan: boolean;
  setPan: React.Dispatch<React.SetStateAction<boolean>>;

  flingRight: boolean;
  setFlingRight: React.Dispatch<React.SetStateAction<boolean>>;

  flingLeft: boolean;
  setFlingLeft: React.Dispatch<React.SetStateAction<boolean>>;

  pinch: boolean;
  setPinch: React.Dispatch<React.SetStateAction<boolean>>;
  tasks: { id: string; title: string; completed: boolean }[];
}

export const TaskContext = createContext<TaskContextType>({} as TaskContextType);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [score, setScore] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [doubleClicks, setDoubleClicks] = useState(0);
  const [longPress, setLongPress] = useState(false);
  const [pan, setPan] = useState(false);
  const [flingRight, setFlingRight] = useState(false);
  const [flingLeft, setFlingLeft] = useState(false);
  const [pinch, setPinch] = useState(false);

  const tasks = [
    { id: '1', title: 'Натисни один раз', completed: clicks > 0 },
    { id: '2', title: 'Натисни двічі', completed: doubleClicks > 0 },
    { id: '3', title: 'Довге натискання', completed: longPress },
    { id: '4', title: 'Проведи пальцем', completed: pan },
    { id: '5', title: 'Змах вправо', completed: flingRight },
    { id: '6', title: 'Змах вліво', completed: flingLeft },
    { id: '7', title: 'Щипок', completed: pinch },
  ];

  return (
    <TaskContext.Provider
      value={{
        score,
        setScore,
        clicks,
        setClicks,
        doubleClicks,
        setDoubleClicks,
        longPress,
        setLongPress,
        pan,
        setPan,
        flingRight,
        setFlingRight,
        flingLeft,
        setFlingLeft,
        pinch,
        setPinch,
        tasks,
      }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => useContext(TaskContext);
