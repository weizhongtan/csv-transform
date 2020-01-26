const isIncome = str => /DIRECT DEBIT PAYMENT/.test(str);

const transformer = json =>
  json
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

const options = {
  in: {
    delimiter: ',', // optional
    quote: '"', // optional
  },
  out: {
    delimiter: ';',
    wrap: false,
  },
};

module.exports = {
  transformer,
  options,
};
