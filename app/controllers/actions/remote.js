/*

Example payload (using [Pusher](https://github.com/noodlewerk/NWPusher)):

{
    "aps": {
        "alert": {
            "title": "Download now?",
            "body": "Get cool extra feautures and more!"
        },
        category: 'DOWNLOAD_CONTENT'
    }
}

*/

// An action that opens the app (foreground action)
const acceptAction = Ti.App.iOS.createUserNotificationAction({
  identifier: 'ACCEPT_IDENTIFIER',
  title: 'Accept',
  activationMode: Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_FOREGROUND,
  destructive: false,
  authenticationRequired: true
});

// An action that does not open the app (background action)
const rejectAction = Ti.App.iOS.createUserNotificationAction({
  identifier: 'REJECT_IDENTIFIER',
  title: 'Reject',
  activationMode: Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND,
  destructive: true,
  authenticationRequired: false
});

// An action that does not open the app (background action), but lets the developer
// type in a text (iOS 9+)
const respondAction = Ti.App.iOS.createUserNotificationAction({
  identifier: 'RESPOND_IDENTIFIER',
  title: 'Respond',
  activationMode: Ti.App.iOS.USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND,
  behavior: Ti.App.iOS.USER_NOTIFICATION_BEHAVIOR_TEXTINPUT, // or: Ti.App.iOS.USER_NOTIFICATION_BEHAVIOR_DEFAULT,
  authenticationRequired: false
});

// Create a notification category
const downloadContent = Ti.App.iOS.createUserNotificationCategory({
  identifier: 'DOWNLOAD_CONTENT',
  actionsForDefaultContext: [acceptAction, rejectAction, respondAction]
});

// Monitor notifications received while app is in the background
Ti.App.iOS.addEventListener('remotenotificationaction', event => {
  if (event.category === 'DOWNLOAD_CONTENT' && event.identifier === 'ACCEPT_IDENTIFIER') {
    Ti.API.warn('start download');
  } else if (event.category === 'DOWNLOAD_CONTENT' && event.identifier === 'RESPOND_IDENTIFIER') {
    alert(event.typedText);
    Ti.API.warn('Response: ' + event.typedText); // Note: Test this by adding a label, because it logs in the background
  }

  // Reset the badge value
  if (event.data.badge > 0) {
    Ti.UI.iOS.appBadge = 0;
  }
  Ti.API.warn(event);
  Ti.API.warn('Event: remotenotificationaction');

  // If the notification was dismissed, "event.identifier" will return "com.apple.UNNotifcationDismissActionIdentifier" for iOS 10+
  $.stateLabel.setText('Action (identifier): ' + e.identifier)
});

// Monitor notifications received while app is in the foreground
Ti.App.iOS.addEventListener('notification', () => {
  Ti.API.warn('Event: notification');
});

function deviceTokenSuccess(event) {
  Ti.API.warn('Successfully registered for remote notifications!');
  Ti.API.warn(event);
}

function deviceTokenError(event) {
  Ti.API.warn('Error while registering for remote notifications!');
  Ti.API.error(event);
}

function receivePush(event) {
  Ti.API.warn('Received remote push notification!');
  Ti.API.warn(event);
}

function registerForPush() {
  Ti.Network.registerForPushNotifications({
    success: deviceTokenSuccess,
    error: deviceTokenError,
    callback: receivePush
  });
  // Remove event listener once registered for push notifications
  Ti.App.iOS.removeEventListener('usernotificationsettings', registerForPush);
};

// Wait for user settings to be registered before registering for push notifications
Ti.App.iOS.addEventListener('usernotificationsettings', registerForPush);

function registerUserNotificationSettings() {
  // Register for user notifications and categories
  Ti.App.iOS.registerUserNotificationSettings({
    types: [
      Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
      Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE,
      Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND
    ],
    categories: [downloadContent]
  });
}
