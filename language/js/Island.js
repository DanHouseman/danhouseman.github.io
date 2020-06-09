function Island(code, model) {
  this.cells = getIslandCells(code);
  this.code = code;
  this.model = model;
  this.name = Math.random();
  this.prefix = choiceRandom([
    'a', 'b', 'z', 'd', 'ü', 'l'
  ]);
  this.words = {};
}

Island.prototype.getAgents = function () {
  return this.model.agents.filter(function (agent) {
    return agent.island === this
  }.bind(this));
};

Island.prototype.getNeighborhoodsOf = function (agent) {
  var allAgents = this.getAgents();
  var neighborhoods = agent.getNeighborhoods();
  var agentId = agent.id;

  return allAgents.filter(function (agent) {
    if (agent.id === agentId) {
      return false;
    };

    return neighborhoods.filter(function (neighborhood) {
      return (
        neighborhood[0] === agent.position[0] &&
        neighborhood[1] === agent.position[1]
      );
    }).length > 0;
  });
};

Island.prototype.addWord = function (instance) {
  if (!this.words[instance.word]) {
    this.words[instance.word] = instance;
  }
};
