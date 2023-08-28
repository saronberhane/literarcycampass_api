function checkKeysExist(object, keys) {
    for (let key of keys) {
      if (!(key in object)) {
        return false;
      }
    }
    return true;
  }

module.exports = checkKeysExist;