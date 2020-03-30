const cache = {};

function setValueForKey(key, value) {
    cache[key] = value;
}

function getValeuForKey(key) {
    return cache[key];
}

function isValueAvailableForKey(key) {
    return !!cache[key];
}

function getkeyForValue(value) {
    for (var key in cache) {
        if (cache.hasOwnProperty(key)) {
          if(cache[key] == value) {
              return key;
          }
        }
    }
    return false;
}

function clearCache() {
    cache = {};
}

module.exports = {
    setValueForKey,
    getValeuForKey,
    isValueAvailableForKey,
    getkeyForValue,
    clearCache
}
