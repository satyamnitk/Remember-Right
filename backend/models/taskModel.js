const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  tasks: [
    {
      task: { type: String, required: true },
      categoryType: {
        type: String,
        required: true,
      },
      isCompleted: {
        type: Boolean,
        default: false,
      },
      createdDate: {
        type: Date,
        default: () => {
          let currentDate = new Date();
          let indianOffset = 5.5 * 60 * 60 * 1000;
          let indianDate = new Date(currentDate.getTime() + indianOffset);
          return indianDate;
        },
      },
    },
  ],
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
