var __MAP__ = [
  '...................................................',
  '...................................................',
  '......AAAAAAAA.....................................',
  '.....AAAAAAAAAAAA..................................',
  '......AAAAAAAAAAAAA................................',
  '......AAAAAAAA...AAAA..................BB..........',
  '........AAAAAA..AAAA...............=BBBBBBB........',
  '.......AAAAAA...AAAA.................BBBBBBB.......',
  '.......AAAAAAA.....................BBBBBBBBBBBB....',
  '...AAAAAAAAAAAAAA=.................BBBBBBBBBBB.....',
  '...AAAAAAAAAAAAAA..................BBBBBBBBBB......',
  '..AAAAAAAAAAAAAAA................BBBBBBBBBBBB......',
  '.AAA....AAAAAAA...................BBBBBBBBB........',
  '.AAA.....AAAAAA...................BBBBBBBBBB.......',
  '...AAAAAAAAAAAAAAA.................BBBBBBBBBB......',
  '...AAAAAAAAA.AAAAAAA................BBBBBBBBB......',
  '...AAAAAAAAAAAAA..................#BBBBBBBBBB......',
  '.......AAAAAAAA-.....................BBBBBB........',
  '.......AAAAAAA.....................BBBBBBB.........',
  '........AAAAAA......................BBBBB..........',
  '..........+..........................BBBB..........',
  '........................................B..........',
  '........................................!..........',
  '...................................................',
  '...................................................',
  '...................................................',
  '..........................................!........',
  '............CCC..CCCCC#...................DDDDD....',
  '...........CCCCCCCCCCCC..............DDDDDDDDDD....',
  '............CCCCCCCCCCCCCC.........-DDDDDDDDDD.....',
  '..............CCCCCCCCCCCCCC.......DDDDDDDDDD......',
  '.............CCCCCCCCCCCCCC.........DDDDDDDDDDDD...',
  '.........+CCCCCCCCCCCCCCCCCC......DDDDDDDDDDDD.....',
  '.........CCCCCCCCCCCCCC...........DDDDDDDDDDDDDD...',
  '........CCCCC..CCCCCCCCCCC......@DD.DDDDDDDDDDD....',
  '...........CCCCC..CCCCCCCC.......DDDDDD...DDDDDD...',
  '................CCCCCCC............DDDDDDDDDD......',
  '.............CCCCCCCCCCC...........DDDD............',
  '..................CCCCCCC@.........................',
  '..................CC...............................',
  '...................................................',
  '...................................................',
].join('');

var WIDTH = 51;

var __POPULATION__ = {
  'A': 16,
  'B': 16,
  'C': 16,
  'D': 16
};

var __ISLANDS__ = {
  'A': ['Island A', '#4BACFF'],
  'B': ['Island B', '#FFC32A'],
  'C': ['Island C', '#F1958F'],
  'D': ['Island D', '#8ff195'],
};

var __INITIAL_WORDS__ = {
  'A': 'zelere',
  'B': 'acaba',
  'C': 'lulere',
  'D': 'datu'
};

var __GATES__ = {
   '=': ['A', 'B'],
   '+': ['A', 'C'],
   '-': ['A', 'D'],
   '#': ['B', 'C'],
   '!': ['B', 'D'],
   '@': ['C', 'D']

};

function mooreNeighborhood(index) {
  var row = Math.floor(index / WIDTH);
  var column = index % WIDTH;
  var map = __MAP__;
  var columnPerRow = WIDTH;
  return [
    map[ (row - 1) * columnPerRow + column - 1 ],  // NW
    map[ (row - 1) * columnPerRow + column ],      // N
    map[ (row - 1) * columnPerRow + column + 1 ],  // NE

    map[ row * columnPerRow + column - 1 ],  // W
    map[ row * columnPerRow + column + 1 ],  // E

    map[ (row + 1) * columnPerRow + column - 1 ],  // SW
    map[ (row + 1) * columnPerRow + column ],      // S
    map[ (row + 1) * columnPerRow + column + 1 ],  // SE
  ];
};

function isGate(x, y) {
  return __GATES__.hasOwnProperty(
    __MAP__[y * WIDTH + x]
  );
};

function cellToPosition(index) {
  return [
    index % WIDTH, 
    Math.floor(index / WIDTH)
  ];
};

function getIslandCells(indicator, excludeGates) {
  var map = Array.prototype.map;
  return map.call(__MAP__, function (node, index) {
    var isGate = (
      __GATES__.hasOwnProperty(node) &&
      mooreNeighborhood(index).filter(
        isEqual(indicator)
      ).length > 0
    );

    if (node === indicator || isGate) {
      return cellToPosition(index);
    }
  }).filter(
    Boolean
  );
};

function getIndicator(x, y) {
  return __MAP__[y * WIDTH + x];
}

function getGates(indicator) {
  var map = Array.prototype.map;
  return map.call(__MAP__, function (node, index) {
    if (node === indicator) {
      return cellToPosition(index);
    }
  }).filter(
    Boolean
  );
}

function findTargetGate(sourceIsland, position) {
  var indicator = getIndicator.apply(null, position);
  var map = Array.prototype.map;
  
  var indexes = map.call(__MAP__, function (node, index) {
    if (node === indicator) {
      return index
    }
  }).filter(
    Boolean
  ).filter(function (index) {
    return (
      mooreNeighborhood(index).indexOf(sourceIsland) === -1
    )
  });

  var targetCell = indexes[0];
  var targetIsland = mooreNeighborhood(
    targetCell
  ).filter(function (key) {
    return __ISLANDS__.hasOwnProperty(key);
  })[0];

  return {
    islandCode: targetIsland,
    position: cellToPosition(targetCell)
  };
}
