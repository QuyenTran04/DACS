const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  userId: { type: Number, ref: "Account", required: true },
  fullName: { type: String, required: true },
  phone: { type: String, unique: true, required: true },
  address: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["male", "female", "other"] },
});
module.exports = mongoose.model("profile", profileSchema);