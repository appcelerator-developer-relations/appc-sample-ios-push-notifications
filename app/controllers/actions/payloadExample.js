(function constructor(args) {
	$.payloadText.value = args.json || '{}';
}(arguments[0] || new Map()));

function copyPayload() {
	Ti.UI.Clipboard.setText($.payloadText.value);

	$.copyButton.title = 'Copied!';
	$.copyButton.enabled = false;

	setTimeout(() => {
		$.copyButton.enabled = true;
		$.copyButton.title = 'Copy';
	}, 1000);
}

function close() {
	$.payloadExample.close();
}

exports.open = () => {
	$.payloadExample.open({
		modal: true
	});
};
