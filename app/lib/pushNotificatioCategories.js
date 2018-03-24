
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
const exampleCategory = Ti.App.iOS.createUserNotificationCategory({
	identifier: 'DOWNLOAD_CONTENT',
	actionsForDefaultContext: [ acceptAction, rejectAction, respondAction ]
});

export { exampleCategory };
