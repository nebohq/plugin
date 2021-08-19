const Initializer = require('./init');
const Compiler = require('./build');
const Watcher = require('./watch');
const CLI = require('./CLI');
const Settings = require('./defaults');

module.exports = {
  CLI,
  Settings,
  commands: {
    Initializer, Compiler, Watcher,
  },
};
