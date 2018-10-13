#!/usr/bin/env node

const csvjson = require('csvjson');
const fs = require('fs');
const { promisify } = require('util');
const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const { log } = console;

const printUsage = () => {
    log(chalk.red('usage: csv-transform --in ./path/to/input.csv [--out ./path/to/output.csv]'));
};

(async () => {
    if (!argv.in) {
        printUsage();
        return;
    }

    const inPath = argv.in;
    const outPath = argv.out || inPath.replace(/.csv$/, '-homebank.csv');

    const csvData = await readFile(inPath, { encoding: 'utf8' });
    const jsonData = csvjson.toObject(csvData, {
        delimiter: ',', // optional
        quote: '"', // optional
    });

    const isIncome = str => /PAYMENT RECEIVED/.test(str);
    const transformed = jsonData
        .filter(d => !isIncome(d.description))
        .map(d => ({
            date: d.date.replace(/T.*/, ''),
            payment: 1, // credit card
            info: '',
            payee: '',
            memo: d.description,
            amount: -d.originalCurrencyAmount, // expense
            category: '',
            tags: 'csv-transfer',
        }));
    const transformedCsv = csvjson.toCSV(transformed, {
        delimiter: ';',
        wrap: false,
    }).replace(/\[\]\./g, '');

    await writeFile(outPath, transformedCsv);

    log(chalk.green('Transformed output file:'), chalk.magenta(outPath));
    log(chalk.cyan('################## OUTPUT ##################'));
    log(chalk.yellow(transformedCsv));
})();
