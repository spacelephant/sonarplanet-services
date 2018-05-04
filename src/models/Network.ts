var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var NetworkSchema   = new Schema({
  uniqueId: String,
  production: Boolean
});

module.exports = mongoose.model('Network', NetworkSchema);
