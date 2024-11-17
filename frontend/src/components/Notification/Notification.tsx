// Notification.tsx
import React from "react";
import useStore from "../../services/store";
import "./Notification.css"; // Make sure to create and import the CSS file

const Notification: React.FC = () => {
  const { notifications, removeNotification } = useStore();

  return (
    <div className="notification-container">
      {notifications.map((noti) => (
        <div
          key={noti.id}
          className={`notification ${noti.type}`}
          onClick={() => removeNotification(noti.id)}
        >
          <span>{noti.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Notification;
