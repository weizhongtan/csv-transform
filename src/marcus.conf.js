const transformer = json =>
  json.map(d => {
    const amount = d.Value;
    const date = d.TransactionDate;

    return {
      date: new Date(
        [date.slice(0, 4), date.slice(4, 6), date.slice(6)].join('-')
      )
        .toISOString()
        .slice(0, 10),
      payment: 0, // no category
      info: '',
      payee: '',
      memo: d.Description,
      amount,
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
