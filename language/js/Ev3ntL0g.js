function Ev3ntL0g() {
  this.events = [];
  this.callback = function () {};
}

Ev3ntL0g.prototype.onUpdate = function (callback) {
  this.callback = callback;
};

Ev3ntL0g.prototype.add = function (eventType, instance) {
  this.events.push(eventType, instance);
  this.callback(eventType, instance);
};

Ev3ntL0g.NEW = 1;
