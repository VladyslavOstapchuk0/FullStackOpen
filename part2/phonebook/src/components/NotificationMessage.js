import React from 'react';

const NotificationMessage = ({ notification }) => {
  if (notification === null || notification.text === '') {
    return;
  } else {
    return (
      <div className={`notification-${notification.type}`}>
        {notification.text}
      </div>
    );
  }
};

export default NotificationMessage;
