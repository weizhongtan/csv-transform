const test = require('ava');
const conf = require('./cap1-homebank.conf');

test.beforeEach(t => {
  t.context.input = [
    {
      date: '2018-11-27T00:00:00Z',
      postedDate: '2018-11-28T17:19:35Z',
      amount: 21.28,
      description: 'RED DOG SALOON LONDON',
      recurringPayment: false,
      originalCurrencyAmount: 21.28,
      conversionRate: 1,
      type: 'Cycled',
      currency: 'GBP',
      debitCreditCode: 'Debit',
      'merchant.name': 'RED DOG SALOON',
      'merchant.town': 'LONDON',
      'merchant.postCode': 'N1 6NN',
      'merchant.country': 'GBR',
    },
  ];
});

test('exports a transformer and options object', t => {
  t.true(typeof conf.transformer === 'function');
  t.true(typeof conf.options === 'object');
  t.pass();
});

test('transformer converts into an acceptable format', t => {
  const { transformer } = conf;
  const expected = [
    {
      date: '2018-11-27',
      payment: 1,
      info: '',
      payee: '',
      memo: 'RED DOG SALOON LONDON',
      amount: -21.28,
      category: '',
      tags: 'csv-transfer',
    },
  ];
  const output = transformer(t.context.input);
  t.deepEqual(output, expected);
  t.pass();
});

test('removes payments', t => {
  const { transformer } = conf;
  t.context.input[0].description = 'DIRECT DEBIT PAYMENT - THANK YOU';
  const expected = [];
  const output = transformer(t.context.input);
  t.deepEqual(output, expected);
  t.pass();
});
