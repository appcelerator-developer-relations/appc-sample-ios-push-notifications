
function handleAction(e) {
	const action = e.itemId;
	$.index.openWindow(Alloy.createController(`actions/${action}`).getView());
}

$.index.open();
