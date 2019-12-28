var fs = require('fs');

var contents = fs.readFileSync('./public/javascripts/constants.js', 'utf8')

module.exports = contents
