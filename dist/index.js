
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./csv-transform.cjs.production.min.js')
} else {
  module.exports = require('./csv-transform.cjs.development.js')
}
