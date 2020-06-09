function Agent(island, model, eventLog, counter) {
  this.island = island;
  this.position = null;
  this.model = model;
  this.id = Math.random();
  this.state = Agent.LIVE;
  this.inbox = null;
  this.eventLog = eventLog;
  this.counter = counter;
  this.vocabulary = [
    new Word(
      __INITIAL_WORDS__[island.code],
      island
    )
  ];
  this.vocabulary.forEach(function (word) {
    island.addWord(word);
  });
}

Agent.LIVE = 1;
Agent.DEAD = 2;

Agent.MUTATION_CHAIN = [
  [0.9, 'NO_MUTATION'],
  [0.02, 'COMPOUND'],
  [0.04, 'CONST'],
  [0.04, 'VOWEL'],
];

// Agent.MUTATION_CHAIN = [
//   [0.5, 'NO_MUTATION'],
//   [0.1, 'COMPOUND'],
//   [0.2, 'CONST'],
//   [0.2, 'VOWEL'],
// ];

Agent.prototype.setup = function () {
  this.position = choiceRandom(this.island.cells);
};

Agent.prototype.getNeighborhoods = function () {
  var x = this.position[0];
  var y = this.position[1];

  return [
    [x, y - 1],
    // [x + 1 , y - 1],
    [x + 1 , y],
    // [x + 1 , y + 1],
    [x, y + 1],
    // [x - 1, y + 1],
    [x - 1, y],
    // [x - 1, y - 1],
  ];
};

Agent.prototype.step = function () {
  if (this.isOnGate()) {
    var targetGate = findTargetGate(this.island.code, this.position);
    var island = this.model.islands[targetGate.islandCode];
    this.position = targetGate.position;
    this.island = island;
  }

  var neighborhoodCells = this.getNeighborhoods();
  var neighborhoodAgents = this.island.getAgents();
  var movableCells = this.island.cells.filter(function (cell) {
    return (
      neighborhoodCells.filter(function (neighborhood) {
        return (
          neighborhood[0] == cell[0] &&
          neighborhood[1] == cell[1]
        );
      }).length > 0
    );
  }).filter(function (cell) {
    return (
      neighborhoodAgents.filter(function (agent) {
        return (
          agent.position[0] == cell[0] &&
          agent.position[1] == cell[1]
        );
      }).length === 0
    );
  });

  var newPosition = choiceRandom(movableCells);
  if (newPosition) {
    this.position = newPosition;
  }

  if (this.inbox) {
    this.readAndReply();
  } else {
    var neighborhoods = this.island.getNeighborhoodsOf(this);
    if (neighborhoods.length) {
      var recipient = neighborhoods[0];
      this.talk(recipient);
    }
  };
  
};

Agent.prototype.talk = function (recipient) {
  this.sendMessage(
    choiceRandom(this.vocabulary),
    recipient
  );

};

Agent.prototype.readAndReply = function () {
  var reply = choiceRandom(this.vocabulary);

  this.sender.learnWord(reply);
  this.learnWord(this.inbox);

  this.counter.count(reply.island.code, reply.word);
  this.counter.count(this.inbox.island.code, this.inbox.word);
  
  this.inbox = null;
  this.sender = null;
};

Agent.prototype.sendMessage = function (message, recipient) {
  this.talkingWith = recipient;
  recipient.receiveMessage(message, this);
};

Agent.prototype.receiveMessage = function (message, sender) {
  this.sender = sender;
  this.inbox = message;
};

Agent.prototype.addToVocabulary = function (instance) {
  this.vocabulary.push(instance);
  this.island.addWord(instance);
};

Agent.prototype.learnWord = function (wordInstance) {
  var words = this.vocabulary.map(attributeGetter('word'));
  var exists = words.indexOf(wordInstance.word) > -1;
  var action = weightedRandom(Agent.MUTATION_CHAIN);
  switch (action) {
    case 'NO_MUTATION':
      if (!exists) {
        this.addToVocabulary(wordInstance);
      }
      break;

    case 'COMPOUND':
      var derived = wordInstance.compoundWith(
        choiceRandom(this.vocabulary),
        this.island
      );

      this.eventLog.add(EventLog.NEW, derived);

      return this.addToVocabulary(derived);

    case 'CONST':
      var derived = wordInstance.mutateConst(this.island);
      this.eventLog.add(EventLog.NEW, derived);
      return this.addToVocabulary(derived);

    case 'VOWEL':
      var derived = wordInstance.mutateVowel(this.island);
      this.eventLog.add(EventLog.NEW, derived);
      return this.addToVocabulary(derived);
  }
};

Agent.prototype.isOnGate = function () {
  return isGate(this.position[0], this.position[1]);
};
