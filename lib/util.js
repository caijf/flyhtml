exports.formatDate = function (date) {
  if (!date) return;
  var now = new Date();
  var gap = now.getTime() - date.getTime();
  var ret = [60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000, 7 * 24 * 60 * 60 * 1000];
  if (gap < ret[0]) {
    return 'just now';
  }
  if (gap < ret[1]) {
    return Math.floor(gap/ret[0]) + ' minutes ago';
  }
  if (gap < ret[2]) {
    return Math.floor(gap/ret[1]) + ' hours ago';
  }
  if (gap < ret[3]) {
    return Math.floor(gap/ret[2]) + ' days ago';
  }
  return date.toLocaleDateString();
};

/**
 * Escape the given string of `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

exports.escape = function (html) {
  var codeSpan = /(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm;
  var codeBlock = /(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g;
  var spans = [];
  var blocks = [];
  var text = String(html).replace(/\r\n/g, '\n')
  .replace('/\r/g', '\n');

  text = '\n\n' + text + '\n\n';

  text = text.replace(codeSpan, function (code) {
    spans.push(code);
    return '`span`';
  });

  text += '~0';

  return text.replace(codeBlock, function (whole, code, nextChar) {
    blocks.push(code);
    return '\n\tblock' + nextChar;
  })
  .replace(/&(?!\w+;)/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/`span`/g, function () {
    return spans.shift();
  })
  .replace(/\n\tblock/g, function () {
    return blocks.shift();
  })
  .replace(/~0$/, '')
  .replace(/^\n\n/, '')
  .replace(/\n\n$/, '');
};
