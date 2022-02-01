const mongoose = require('mongoose')

const visitorSchema = new mongoose.Schema({
    name: String,
    count: Number
})
  
// Creating Visitor Table in visitCounterDB
module.exports = mongoose.model("Visitor",visitorSchema)
  