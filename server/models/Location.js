const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, 
});

module.exports = mongoose.model("Location", locationSchema);
