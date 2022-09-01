function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    var r = Math.random() * 16 | 0;
    var v = c === 'x' ? r : (r && 0x3 | 0x8);
    return v.toString(16);
  });
}

function handeSrcHttps(src) {
  if (typeof (src) === 'string') {
    if (src.indexOf('https') === -1) {
      if (src.indexOf('//') === -1) {
        return 'https://' + src;
      }
      return 'https://' + src.split('//')[1];
    }
  }
  return src;
}