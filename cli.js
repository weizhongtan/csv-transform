#!/usr/bin/env node

const csvjson = require('csvjson');
const fs = require('fs');
const { promisify } = require('util');
const argv = require('minimist')(process.argv.slice(2));

const { log, types: { error, info, special } } = require('./log');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const exitCode = (async () => {
    const inPath = argv.in;
    const outPath = argv.out;
    const configPath = argv.config;

    if (!inPath || !outPath || !configPath) {
        log(error('usage: csv-transform --config ./cap1-homebank.conf.js --in ./path/to/input.csv [--out ./path/to/output.csv]'));
        return 4;
    }

    let config;
    try {
        config = require(configPath); // eslint-disable-line
    } catch (err) {
        log(error(`Cannot read config file: ${configPath}`));
        return 1;
    }

    if (typeof config.transformer !== 'function') {
        log(error(`Cannot read config file: ${configPath}`));
        return 2;
    }

    if (!('options' in config && 'in' in config.options && 'out' in config.options)) {
        log(error(`Malformed config export: ${configPath}`));
        return 3;
    }

    let csvData;
    try {
        csvData = await readFile(inPath, { encoding: 'utf8' });
    } catch (err) {
        log(error(`Cannot read in file: ${inPath}`));
        return 5;
    }
    const jsonData = csvjson.toObject(csvData, config.options.in);

    const transformed = config.transformer(jsonData);

    // strip out "[]." notation from headings
    const transformedCsv = csvjson.toCSV(transformed, config.options.out).replace(/\[\]\./g, '');

    await writeFile(outPath, transformedCsv);

    log(info('Transformed output file:'), special(outPath));
    log(special('################## OUTPUT ##################'));
    log(info(transformedCsv));

    return 0;
})();

(async () => {
    const code = await exitCode;
    process.exit(code);
})();
