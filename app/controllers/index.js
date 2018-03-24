import { exampleCategory } from 'pushNotificatioCategories';
import { apnsPush } from 'aps/apns_push';
import { apnsSilent } from 'aps/apns_silent';

(function constructor() {
	Ti.App.iOS.addEventListener('silentpush', function (event) {
		Ti.API.info(event);
		Ti.App.Properties.setString('test_prop', 'Saved this string with a silent push!');
		Ti.App.iOS.endBackgroundHandler(event.handlerId);
	});

	// Monitor notifications received while app is in the foreground
	Ti.App.iOS.addEventListener('notification', function () {
		Ti.API.warn('event: notification');
	});

	// Monitor notifications received while app is in the background
	Ti.App.iOS.addEventListener('remotenotificationaction', function (event) {
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
		Ti.API.warn('event: remotenotificationaction');

		// If the notification was dismissed, "event.identifier" will return "com.apple.UNNotifcationDismissActionIdentifier" for iOS 10+
		// statusLabel.setText('Action (identifier): ' + event.identifier);
	});
}());

// This method changes the notification settings between index 0 (Remote Push) and iddex 1 (Silent Push)
// which have different notification settings and fire different events
function changeNotificationSettings(event) {
	const exampleAPSPayloads = [ apnsPush, apnsSilent ];
	const remotePushSettings = [
		// Push Notifications
		{
			types: [
				Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
				Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE,
				Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND
			],
			categories: [ exampleCategory ]
		},
		// Silent Notifications
		{
			types: [
				Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE
			]
		}
	];
	Ti.App.iOS.registerUserNotificationSettings(remotePushSettings[event.index]);
	showPayloadExample(JSON.stringify(exampleAPSPayloads[event.index], null, 4)); // Pretty-printed, 4 spaces indentation
}

function showPayloadExample(json) {
	Alloy.createController('/actions/payloadExample', {
		json: json
	}).open();
}

function handleAction(event) {
	const action = event.itemId;
	if (action !== 'richNotifications') {
		return;
	}

	$.index.openWindow(Alloy.createController(`actions/${action}`).getView());
}

$.index.open();
