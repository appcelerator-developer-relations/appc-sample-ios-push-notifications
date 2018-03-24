let notificationParams = {};
let actions = [];
let actionIdentifiers = [];

(function constructor() {

}());

function validateNotification() {
	$.scheduleButton.enabled = Object.keys(notificationParams).length > 0;
	Ti.API.info(notificationParams);
}

// Monitor notifications received while app is in the background
Ti.App.iOS.addEventListener('localnotificationaction', (event) => {
	if (event.identifier === 'RESPOND_IDENTIFIER') {
		Ti.API.warn('Response: ' + event.typedText); // Note: Test this by adding a label, because it logs in the background
	}

	// Reset the badge value
	if (event.badge > 0) {
		Ti.UI.iOS.appBadge = 0;
	}

	Ti.API.warn('Event: localnotificationaction');
});

Ti.App.iOS.addEventListener('usernotificationsettings', () => {
	Ti.API.warn('Event: usernotificationsettings');
});

// Monitor notifications received while app is in the foreground
Ti.App.iOS.addEventListener('notification', () => {
	Ti.API.warn('Event: notification');
});

function schedule() {
	Ti.App.iOS.scheduleLocalNotification(Object.assign(notificationParams, { category: 'EXAMPLE_CATEGORY' }));
}

function selectDate(event) {
	const item = event.section.getItemAt(event.itemIndex);

	_showPicker(date => {
		item.selectedValue.text = `${date.toLocaleDateString()}, ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
		event.section.updateItemAt(event.itemIndex, item);

		notificationParams['date'] = date;
		validateNotification();
	});
}

function selectFieldValue(event) {
	const identifier = event.itemId.split('config_')[1]; // e.g. "config_actionTitle" becomes "actionTitle". A bit too generic, but ok for now

	if (event.value && event.value.length > 0) {
		notificationParams[identifier] = event.value;
	} else {
		delete notificationParams[identifier];
	}

	validateNotification();
}

function persistFieldValue(event) {
	const item = event.section.getItemAt(event.itemIndex);
	const identifier = event.itemId.split('config_')[1]; // e.g. "config_actionTitle" becomes "actionTitle". A bit too generic, but ok for now
	item.selectedValue.value = event.value;
	event.section.updateItemAt(event.itemIndex, item);
}

function selectSwitchValue(event) {
	const item = event.section.getItemAt(event.itemIndex);
	const itemId = event.itemId;

	item.selectedValue.value = event.value;
	event.section.updateItemAt(event.itemIndex, item);

	const isForeground = itemId === 'config_foreground_action';
	const isBackground = itemId === 'config_background_action';
	const isRespond = itemId === 'config_respond_action';

	const activationMode = Ti.App.iOS[isForeground ? 'USER_NOTIFICATION_ACTIVATION_MODE_FOREGROUND' : 'USER_NOTIFICATION_ACTIVATION_MODE_BACKGROUND'];
	const title = isForeground ? 'Accept' : isBackground ? 'Decline' : isRespond ? 'Respond Now' : 'Unknown Action';
	const identifier = isForeground ? 'ACCEPT_ID' : isBackground ? 'DECLINE_ID' : isRespond ? 'RESPOND_ID' : 'UNKNOWN_ID';
	const behavior = Ti.App.iOS[isRespond ? 'USER_NOTIFICATION_BEHAVIOR_TEXTINPUT' : 'USER_NOTIFICATION_BEHAVIOR_DEFAULT'];

	if (actionIdentifiers.indexOf(itemId) === -1) {
		actionIdentifiers.push(itemId);
		actions.push(Ti.App.iOS.createUserNotificationAction({
			identifier: identifier,
			title: title,
			behavior: behavior,
			activationMode: activationMode, // Use background activation for "Decline" and "Response"
			destructive: isBackground, // Enable the "red" destructive button for background-actions
			authenticationRequired: isRespond || isForeground // Enable auth for respond-actions and foreground-actions
		}));
	} else {
		actionIdentifiers.splice(actionIdentifiers.indexOf(itemId), 1);
		actions.splice(actionIdentifiers.indexOf(itemId), 1);
	}

	updateNotificationSettings();
	validateNotification();
}

function selectStepperValue(event) {
	const item = event.section.getItemAt(event.itemIndex);
	item.stepperLabel.text = String(event.value);
	item.selectedValue.value = event.value;
	event.section.updateItemAt(event.itemIndex, item);

	notificationParams['badge'] = event.value;
	validateNotification();
}

function selectTabbedValue(event) {
	const item = event.section.getItemAt(event.itemIndex);

	const attachments = [ {
		identifier: 'imageAttachment',
		url: 'titanium_logo.png'
	}, {
		identifier: 'videoAttachment',
		url: 'sample_video.mp4'
	}, {
		identifier: 'audioAttachment',
		url: 'sample_audio.mp3'
	} ];

	item.selectedValue.index = event.index;
	event.section.updateItemAt(event.itemIndex, item);

	notificationParams['attachments'] = [ attachments[event.index] ]; // Only use one attachment for now
	validateNotification();
}

// TODO: Move to index.js to work even if app closed
function updateNotificationSettings() {
	var category = Ti.App.iOS.createUserNotificationCategory({
		identifier: 'EXAMPLE_CATEGORY',
		actionsForDefaultContext: Array.from(actions)
	});

	// Will trigger the push permissions dialog and the "usernotificationsettings" event afterwards
	Ti.App.iOS.registerUserNotificationSettings({
		types: [
			Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
			Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE,
			Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND
		],
		categories: [ category ]
	});
}

function _showPicker(cb) {
	const modalPicker = Alloy.createController('/modalpicker', {
		parent: $.window,
		onSelectedCallback: cb
	});
	modalPicker.show();
}
