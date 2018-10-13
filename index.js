#!/usr/bin/env node
const csvjson = require('csvjson');
const fs = require('fs');

const csvFilePath = process.argv[2];
const csvData = fs.readFileSync(csvFilePath, { encoding: 'utf8' });
const jsonData = csvjson.toObject(csvData, {
  delimiter: ',', // optional
  quote: '"', // optional
});
const transformed = jsonData.map(d => ({
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
const transformedFilePath = csvFilePath.replace(/.csv$/, '-homebank.csv');
fs.writeFileSync(transformedFilePath, transformedCsv);
console.log('wrote file:', transformedFilePath);
console.log('################## OUTPUT ##################\n', transformedCsv);
