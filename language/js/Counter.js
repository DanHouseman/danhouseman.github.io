function Counter(size) {
  this.size = size || 50;
  this.table = {};
  this.payload = {};
}

Counter.prototype.count = function (key, item, payload) {
  var table = this.table;

  if (!table[key]) {
    table[key] = [];
  };

  table[key].push(item);

  if (table[key].length >= this.size) {
    table[key].shift();
  }
};

Counter.prototype.mostOccurrence = function (key) {
  var items = this.table[key];

  if (!items) {
    return null;
  }

  var modeMap = {};
  var maxEl = items[0], 
      maxCount = 1;

  for (var i = 0; i < items.length; i++) {
    var el = items[i];
    if(modeMap[el] == null) {
      modeMap[el] = 1;
    } else {
      modeMap[el]++;  
    }
    
    if(modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }

  return maxEl;
}