const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const accountSchema = new mongoose.Schema({
  _id: { type: Number },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "provider","employee"], default: "user" },
  //createdAt: { type: Date, default: Date.now },
});
accountSchema.plugin(AutoIncrement, { inc_field: "_id" });

const account = mongoose.model("account", accountSchema);

module.exports = account;
