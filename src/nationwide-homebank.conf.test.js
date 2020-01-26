const test = require('ava');
const conf = require('./nationwide-homebank.conf');

test('exports a transformer and options object', t => {
  t.true(typeof conf.transformer === 'function');
  t.true(typeof conf.options === 'object');
  t.pass();
});

test('transformer converts input into correct format', t => {
  const { transformer } = conf;
  const input = [
    {
      date: '21 Jul',
      memo: 'Effective Date beans',
      out: '23',
      in: null,
    },
    {
      date: '21 Jul',
      memo: 'EE TOP UP VESTA',
      out: '10',
      in: null,
    },
    {
      date: '23 Jul',
      memo: '(Recurring VISA Transaction)',
      out: null,
      in: null,
    },
    {
      date: '23 Jul',
      memo: 'Contactless Payment',
      out: '4.1',
      in: null,
    },
    {
      date: '23 Jul',
      memo: 'TSGN - ST PANCRAS INTE LONDON',
      out: null,
      in: null,
    },
  ];
  const expected = [
    {
      date: '2017-07-21',
      payment: 0,
      info: '',
      payee: '',
      memo: 'Effective Date beans',
      amount: -23,
      category: '',
      tags: 'csv-transfer',
    },
    {
      date: '2017-07-21',
      payment: 0,
      info: '',
      payee: '',
      memo: 'EE TOP UP VESTA',
      amount: -10,
      category: '',
      tags: 'csv-transfer',
    },
    {
      date: '2017-07-23',
      payment: 0,
      info: '',
      payee: '',
      memo: 'TSGN - ST PANCRAS INTE LONDON',
      amount: -4.1,
      category: '',
      tags: 'csv-transfer',
    },
  ];
  const output = transformer(input);
  t.deepEqual(output, expected);
  t.pass();
});
