const { Schema, model } = require("mongoose");

const donationSchema = new Schema({
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  donor: { type: Schema.Types.ObjectId, ref: "User" },
  receiver: { type: Schema.Types.ObjectId, ref: "User" },
  amount: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Donation = model("Donation", donationSchema);

module.exports = Donation;
