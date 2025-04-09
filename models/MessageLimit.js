const mongoose = require('mongoose');

const messageLimitSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  nonPremium: {
    type: Map,
    of: Number, 
    default: {}
  },
  premium: {
    type: Map,
    of: Number, 
    default: {}
  }
});

module.exports = mongoose.model('MessageLimit', messageLimitSchema);
