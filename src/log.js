const chalk = require('chalk');

const { log } = console;
const types = {
    error: chalk.red,
    info: chalk.green,
    special: chalk.cyan,
};

module.exports = {
    log,
    types,
};
