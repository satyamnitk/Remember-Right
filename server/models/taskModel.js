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
        required: true,
      },
      isTask: {
        type: Boolean,
        required: true,
      },
      isShow: {
        type: Boolean,
        default: true,
        required: true,
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
