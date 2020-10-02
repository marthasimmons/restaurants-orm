const {Database} = require('sqlite3')
db = new Database(':memory:')

module.exports = db