// const admin = require("firebase-admin");
const axios = require("axios");
require("dotenv").config();

// Hàm gửi thông báo push đến một thiết bị cụ thể
const sendNotification = async () => {
  const serverKey = process.env.SERVER_KEY; // Server key from Firebase console
  const deviceToken =
    "eiu1k7EfSIyTdBKl2q7ly3:APA91bE8PSetGf1Bu-F53KZkIgtnrKLGprFhXzLmVMlpHO25jigofisXzvEk121yBX7tjPBJXNGb7JVHr3yw7rYz-wZBJM0-0y3U93HrF4rGwTLtKihYfx93ZdTjRxoLVBWT7-4GyJbH";

  const datapayload = {
    to: deviceToken,
    notification: {
      title: "New notification in your app",
      body: "Someone is waiting for your approval!",
    },
    priority: "high",
    time_to_live: 3600,
  };

  await axios
    .post("https://fcm.googleapis.com/fcm/send", datapayload, {
      headers: {
        Authorization: `key=${serverKey}`,
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

module.exports = {
  sendNotification,
};
