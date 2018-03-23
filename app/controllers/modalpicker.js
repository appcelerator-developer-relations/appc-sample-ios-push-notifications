let onSelectedCallback;
let parent;

(function constructor(args) {
  onSelectedCallback = args.onSelectedCallback;
})(arguments[0] || new Map());

const show = () => {
  $.modalpicker.open();
}

const hide = () => {
  $.modalpicker.animate({
    backgroundColor: 'transparent'
  });
  $.container.animate({
    opacity: 0.0,
    duration: 300
  }, () => {
    $.modalpicker.close();
  });
}

const _showPickerView = () => {
  $.modalpicker.animate({
    backgroundColor: 'rgba(0,0,0,0.3)'
  });
  $.container.animate({
    opacity: 1.0,
    duration: 300
  });
}

const select = () => {
  onSelectedCallback && onSelectedCallback($.picker.value);
}

exports.show = show;
exports.hide = hide;
