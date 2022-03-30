const fs = require('fs')

fs.appendFile('test.txt', 'asd', (err) => {
  if (err) {
    throw err
  }
})
