const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  done: {
    type: Boolean,
    default: false,
  },
  deadline: {
    type: Date,
  },
});

module.exports = new mongoose.model("Task", taskSchema);
