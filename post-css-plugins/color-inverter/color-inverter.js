var postcss = require('postcss');
var colorNames = require('./color-names');

function invertColorRGB(color) {
  var numbers = color.match(/\d+\.?\d*/g);
  for (var i = 0; i < numbers.length; i++) {
    numbers[i] = (i === 3 ? 1 : 255) - parseFloat(numbers[i]);
  }
  return 'rgb' + (numbers.length > 3 ? 'a' : '') + '(' + numbers.join(', ') + ')';
}

function invertColorHex(hex) {

  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }

  // Convert 3-digit hex to 6-digits.
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }

  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }

  // Invert color components
  var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16);
  var g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16);
  var b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);

  // Pad each with zeros and return
  return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str, len) {
  len = len || 2;
  var zeros = new Array(len).join('0');
  return (zeros + str).slice(-len);
}

function isColorName(color) {
  return typeof colorNames[color] !== 'undefined';
}

function isColorRGB(color) {
  console.log(color.toLowerCase().indexOf('rgba('));
  return color.toLowerCase().indexOf('rgb(') === 0 || color.toLowerCase().indexOf('rgba(') === 0;
}

function isColorHex(color) {
  return /^#[0-9A-F]{3}([0-9A-F]{3})?$/i.test(color);
}

function checkAndInvertColor(color) {

  // Invert HEX color
  if (isColorHex(color)) {
    color = invertColorHex(color);
  }

  // Invert RGB color
  if (isColorRGB(color)) {
    color = invertColorRGB(color);
  }

  // Invert color name
  if (isColorName(color)) {
    color = invertColorHex(colorNames[color]);
  }

  return color;
}

var colorInverter = postcss.plugin('color-inverter', function(options) {

  return function(css) {

    options = options || {};

    css.walkRules(function(rule) {

      rule.walkDecls(function(decl, i) {

        // Split property value parts
        var parts = decl.value.split(' ');

				// Invert colors
        for (var j = 0; j < parts.length; j++) {
          parts[j] = checkAndInvertColor(parts[j]);
        }

				// Join parts again
				decl.value = parts.join(' ');

      });

    });
  }
});

module.exports = colorInverter;
