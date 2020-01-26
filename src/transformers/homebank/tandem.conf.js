const transformer = json =>
  json.map(d => {
    return {
      date: d.date,
      payment: 0, // no category
      info: '',
      payee: '',
      memo: d.memo,
      amount: `${d.amount}`,
      category: '',
      tags: 'csv-transfer',
    };
  });

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
