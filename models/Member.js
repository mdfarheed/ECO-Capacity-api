const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  title: { type: String },
  categoryPrimary: { type: String },
  categorySecondary: { type: String },
  status: { type: String },
  shortSummary: { type: String },
  relevance: { type: String },
  fullNarrativeBio: { type: String },
  profileImg: {
    url: { type: String },
    public_id: { type: String }
  },
  linkedIn: { type: String },
  wikipedia: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Member", memberSchema);
