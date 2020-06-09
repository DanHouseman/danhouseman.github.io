function EventLog() {
  this.events = [];
  this.callback = function () {};
}

EventLog.prototype.onUpdate = function (callback) {
  this.callback = callback;
};

EventLog.prototype.add = function (eventType, instance) {
  this.events.push(eventType, instance);
  this.callback(eventType, instance);
};

EventLog.NEW = 1;
