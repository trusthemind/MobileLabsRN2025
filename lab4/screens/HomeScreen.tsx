import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import { db } from 'config/firebase.config';

const AddTaskScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const saveTask = async () => {
    const taskRef = await addDoc(collection(db, 'tasks'), {
      title,
      description,
      remindAt: date.toISOString(),
      onesignalId: '',
    });

    const response = await fetch('https://onesignal.com/api/v1/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic YOUR_ONESIGNAL_REST_API_KEY',
      },
      body: JSON.stringify({
        app_id: 'YOUR_ONESIGNAL_APP_ID',
        included_segments: ['All'],
        send_after: date.toISOString(),
        contents: { en: title },
        data: { taskId: taskRef.id },
      }),
    });

    const data = await response.json();

    await updateDoc(doc(db, 'tasks', taskRef.id), {
      onesignalId: data.id,
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />
      <Button title="Pick Date" onPress={() => setOpen(true)} />
      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(d) => {
          setOpen(false);
          setDate(d);
        }}
        onCancel={() => setOpen(false)}
      />
      <Button title="Save Task" onPress={saveTask} />
    </View>
  );
};

export default AddTaskScreen;
