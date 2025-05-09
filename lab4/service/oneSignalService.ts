import axios from 'axios';

const APP_ID = process.env.ONESIGNAL_APP_ID;
const API_KEY = process.env.ONESIGNAL_API_KEY;

interface NotificationParams {
  id: string;
  title: string;
  dateTime: string;
}

export const scheduleNotification = async ({ id, title, dateTime }: NotificationParams) => {
  const response = await axios.post(
    'https://onesignal.com/api/v1/notifications',
    {
      app_id: APP_ID,
      headings: { en: 'Нагадування' },
      contents: { en: title },
      include_external_user_ids: [id],
      send_after: new Date(dateTime).toISOString(),
    },
    {
      headers: {
        Authorization: `Basic ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data.id;
};

export const cancelNotification = async (notificationId: string) => {
  await axios.delete(`https://onesignal.com/api/v1/notifications/${notificationId}`, {
    headers: {
      Authorization: `Basic ${API_KEY}`,
    },
  });
};
