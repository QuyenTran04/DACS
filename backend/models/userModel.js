const mongoose = require("mongoose");
const Counter = require("../counter"); 

const accountSchema = new mongoose.Schema({
  _id: { type: Number },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin", "provider"], default: "user" },
  //createdAt: { type: Date, default: Date.now },
});


accountSchema.pre("save", async function (next) {
  if (this.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: "accountId" }, 
      { $inc: { seq: 1 } }, 
      { new: true, upsert: true }
    );
    this._id = counter.seq;
  }
  next();
});

const account = mongoose.model("account", accountSchema);

module.exports = account;
