import { exampleCategory } from 'pushNotificatioCategories';
import { apnsPush } from 'aps/apns_push';
import { apnsSilent } from 'aps/apns_silent';

(function constructor() {
	Ti.App.iOS.addEventListener('silentpush', function(e) {
	    Ti.API.info(e);
	    Ti.App.Properties.setString('test_prop', 'Saved this string with a silent push!');
	    Ti.App.iOS.scheduleLocalNotification({
	        alertTitle: 'Yess!',
	        alertBody: 'Silent push executed!',
	        date: new Date().getTime() + 3000
	    });
	    Ti.App.iOS.endBackgroundHandler(e.handlerId);
	});

	// Monitor notifications received while app is in the foreground
	Ti.App.iOS.addEventListener('notification', function(e) {
	  Ti.API.warn('event: notification');
	});

	// Monitor notifications received while app is in the background
	Ti.App.iOS.addEventListener('remotenotificationaction', function(e) {
	  if (e.category === 'DOWNLOAD_CONTENT' && e.identifier === 'ACCEPT_IDENTIFIER') {
	    Ti.API.warn('start download');
	  } else if (e.category === 'DOWNLOAD_CONTENT' && e.identifier === 'RESPOND_IDENTIFIER') {
	    alert(e.typedText);
	    Ti.API.warn('Response: ' + e.typedText); // Note: Test this by adding a label, because it logs in the background
	  }

	  // Reset the badge value
	  if (e.data.badge > 0) {
	    Ti.UI.iOS.appBadge = 0;
	  }
	  Ti.API.warn(e);
	  Ti.API.warn('event: remotenotificationaction');

	  // If the notification was dismissed, "e.identifier" will return "com.apple.UNNotifcationDismissActionIdentifier" for iOS 10+
	  statusLabel.setText('Action (identifier): ' + e.identifier)
	});
})();

// This method changes the notification settings between index 0 (Remote Push) and iddex 1 (Silent Push)
// which have different notification settings and fire different events
function changeNotificationSettings(event) {
	const exampleAPSPayloads = [apnsPush, apnsSilent];
	const remotePushSettings = [
		// Push Notifications
		{
			types: [
				Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT,
				Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE,
				Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND
			],
			categories: [exampleCategory]
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
	Alloy.createController('/actions/payloadExample', { json: json }).open();
}

function handleAction(e) {
	const action = e.itemId;
	if (action !== 'richNotifications') { return };

	$.index.openWindow(Alloy.createController(`actions/${action}`).getView());
}

$.index.open();
