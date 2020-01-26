const convertDate = (d, y) =>
  new Date(`06:00 ${d} ${y}`).toISOString().slice(0, 10);

const transformer = json => {
  const filtered = json.reduce((arr, entry) => {
    const prev = arr[arr.length - 1];

    if (!entry.in && !entry.out) {
      // collapse entries following contactless payments into previous entries
      if (prev && /Contactless/.test(prev.memo)) {
        arr[arr.length - 1].memo = entry.memo;
      }

      // otherwise, remove useless entries
      return arr;
    }
    if (!entry.date) {
      entry.date = prev.date;
    }
    arr.push(entry);
    return arr;
  }, []);

  return filtered.map(d => {
    const amount = d.in ? d.in : -d.out;

    return {
      date: convertDate(d.date, 2017),
      payment: 0, // no category
      info: '',
      payee: '',
      memo: d.memo,
      amount,
      category: '',
      tags: 'csv-transfer',
    };
  });
};

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
